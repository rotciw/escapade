import { PortableText } from '@portabletext/react';
import React, { useEffect, useState } from 'react';
import sanityClient from '~/sanityClient';
import { SanityWikiBankData } from '~/types';
import imageUrlBuilder from '@sanity/image-url';
import TableOfContents from './tableOfContents';
import MapComponent from './mapComponent';
import getYouTubeId from 'get-youtube-id';
import YouTube from 'react-youtube';

interface AnswerProps {
  role: number;
}

const ExpertComponent: React.FC<AnswerProps> = ({ role }) => {
  const center = { lat: 50, lng: 0 };
  const [wikiBankData, setWikiBankData] = useState<SanityWikiBankData[]>();
  const [text, setText] = useState(null);
  const [tableOfContents, setTableOfContents] = useState(null);
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "wikiBanks" && id == ${role}]{
            role,
            id,
            description,
            text[],
            tableOfContents[],
          }
      `,
      )
      .then((data) => {
        setWikiBankData(data);
        if (data[0]) {
          setText(data[0].text);
          setTableOfContents(data[0].tableOfContents);
        }
      })
      .catch((error) => console.error(error));
    return () => {
      setText(null);
      setTableOfContents(null);
    };
  }, [role]);

  const builder = imageUrlBuilder(sanityClient);

  function urlFor(source: any) {
    return builder.image(source);
  }

  const SampleImageComponent = ({ value }: any) => {
    return <img src={urlFor(value.asset).url()} alt={value.alt || ' '} loading='lazy' />;
  };

  const components = {
    block: {
      h1: ({ children }: any) => {
        return <h1 className='mt-2 text-2xl font-bold'>{children}</h1>;
      },
      h2: ({ children }: any) => <h1 className='mt-2 text-xl font-bold'>{children}</h1>,
      h3: ({ children }: any) => <h1 className='mt-1 font-bold text-l'>{children}</h1>,
      normal: ({ children }: any) => <p className='my-2'>{children}</p>,
    },
    types: {
      image: SampleImageComponent,
      youtube: ({ value }: any) => {
        const { url } = value;
        const id = getYouTubeId(url);
        return <YouTube videoId={id as string} />;
      },
    },
    marks: {
      // This mark from Sanity gives the corresponding ID to scroll to
      parentId: ({ children, value }: any) => {
        return <span id={value.parentId}>{children}</span>;
      },
    },
  };
  if (!wikiBankData) return <>Loading</>;

  if (!text) return <>No text</>;

  return (
    <div className='flex flex-row mt-6 w-[99vw] mx-auto md:w-[95vw] flex-wrap md:flex-nowrap'>
      <div className='md:w-1/4 mx-auto w-[95vw] mb-4 md:mr-4'>
        <TableOfContents tableOfContents={tableOfContents} />
      </div>
      <div className='md:w-3/4 w-[95vw] overflow-y-auto pt-5 px-8 pb-8 bg-alice-blue mx-auto max-h-full rounded text-black md:h-[75vh]'>
        {role == 2 && (
          <>
            <h1 className='text-2xl font-bold'>Kart</h1>
            <div className='h-full mb-6'>
              <MapComponent center={center}>
                <>Test</>
              </MapComponent>
            </div>
          </>
        )}
        <PortableText value={text} components={components} />
      </div>
    </div>
  );
};

export default ExpertComponent;
