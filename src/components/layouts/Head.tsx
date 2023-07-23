import DefaultHead from 'next/head';

export interface HeadProps {
    title?: string
    description?: string
}

const Head = (props: HeadProps) => {
  return (
    <DefaultHead>
      <title>{'LIGHTの地図メーカーだよ' + (props.title != null ? ` | ${props.title}` : ' ')}</title>
      <meta name="description" content={props.description ?? 'LIGHTの地図メーカーだよ'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/images/logo.png" />
    </DefaultHead>
  );
}

export default Head;