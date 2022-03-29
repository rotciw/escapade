import { PortableText } from '@portabletext/react';
import React, { useState } from 'react';

interface ToCProps {
  tableOfContents: any;
}

const TableOfContents: React.FC<ToCProps> = ({ tableOfContents }) => {
  const [clickedContent, setClickedContent] = useState();
  const components = {
    block: {
      h1: ({ children }: any) => {
        return <h1 className='my-2 text-2xl font-bold'>{children}</h1>;
      },
      h2: ({ children }: any) => <h1 className='mt-2 text-xl font-bold'>{children}</h1>,
      h4: ({ children }: any) => <h1 className='mb-2 -mt-2 text-sm'>{children}</h1>,
      normal: ({ children }: any) => <p className='my-2'>{children}</p>,
    },
    lists: {
      // Ex. 1: customizing common list types
      bullet: ({ children }: any) => <ul className='mt-xl'>{children}</ul>,
      number: ({ children }: any) => <ol key={children}>{children}</ol>,
    },
    listItem: {
      // Ex. 1: customizing common list types
      bullet: ({ children }: any) => (
        <li style={{ listStyleType: 'disclosure-closed' }}>{children}</li>
      ),
      number: ({ children }: any) => {
        return <li className={`list-decimal mt-1 ml-6`}>{children}</li>;
      },
    },
    marks: {
      id: ({ children, value }: any) => {
        // Give the ToC element a id to scroll to
        return (
          <a
            className={`${
              clickedContent == children ? 'font-bold text-independence' : ''
            } cursor-pointer hover:text-independence`}
            onClick={(e) => {
              e.preventDefault();
              setClickedContent(children[0]);
              document.querySelector(`#${value.divId}`)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {children}
          </a>
        );
      },
    },
  };
  return (
    <nav
      className='sticky px-4 pt-1 pb-1 overflow-y-auto md:h-[75vh] text-black rounded md:px-5 md:pt-4 md:pb-4 bg-alice-blue'
      aria-label='Table of contents'
    >
      <PortableText value={tableOfContents} components={components} />
    </nav>
  );
};

export default TableOfContents;
