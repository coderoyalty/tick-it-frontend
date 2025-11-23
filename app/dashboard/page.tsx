'use client';
'./components/style.css';
import dynamic from 'next/dynamic';

const DynamicSearchByMap = dynamic(() => import('./components/SearchByMap'), {
  ssr: false,
});

export default function () {
  return (
    <>
      <div id="map" className="max-w-full h-screen">
        <DynamicSearchByMap />
      </div>
    </>
  );
}
