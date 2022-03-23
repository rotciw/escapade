import { PortableText } from '@portabletext/react';
import React, { useEffect, useState } from 'react';
import sanityClient from '~/sanityClient';
import { SanityWikiBankData } from '~/types';
import imageUrlBuilder from '@sanity/image-url';
import TableOfContents from './tableOfContents';

interface AnswerProps {
  role: number;
}

const ExpertComponent: React.FC<AnswerProps> = ({ role }) => {
  const [wikiBankData, setWikiBankData] = useState<SanityWikiBankData[]>();
  const [text, setText] = useState();
  const [tableOfContents, setTableOfContents] = useState();
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
      normal: ({ children }: any) => <p className='my-2'>{children}</p>,
    },
    types: {
      image: SampleImageComponent,
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
      <div className='md:w-1/4 mx-auto w-[85vw] mb-4 md:mr-4 md:h-[85vh]'>
        <TableOfContents tableOfContents={tableOfContents} />
      </div>
      <div className='md:w-3/4 w-[85vw] overflow-y-auto flex flex-col pt-5 px-8 pb-8 bg-alice-blue mx-auto rounded text-black h-[75vh] md:h-[85vh]'>
        <PortableText value={text} components={components} />
      </div>
    </div>
  );
};

export default ExpertComponent;
