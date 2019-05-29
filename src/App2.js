import React, {Suspense} from 'react';

const Spinner = () => {
  console.log('spinning...');
  return <div>spinning...</div>;
};

let data = null,
  promise;

function LazyData(props, context) {
  debugger;
  if (data) {
    console.log('Lazy data ready!');
    return <div>{data.foo}</div>;
  }

  if (!promise) {
    promise = new Promise(resolve => {
      setTimeout(() => {
        data = {foo: 'bar'};
        resolve();
      }, 5000);
    });
  }

  console.log('Lazy data pending...');
  throw promise;
}

const LazyComponent = () => <div>Lazy Component</div>;

export default () => {
  return () => (
    <div>
      <h1>Hello world</h1>
      <Suspense fallback={<Spinner />}>
        <LazyComponent />
        <LazyData />
      </Suspense>
    </div>
  );
};
