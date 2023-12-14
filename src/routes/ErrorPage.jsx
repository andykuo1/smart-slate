import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-10">
      <h1 className="text-6xl font-bold">Jinkies! :(</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-400 max-w-[60vw] break-all overflow-y-auto">
        <i>
          {
            // @ts-ignore
            error.statusText || error.message
          }
        </i>
      </p>
    </div>
  );
}
