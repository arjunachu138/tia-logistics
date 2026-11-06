import { Suspense, type ComponentType } from 'react';

const Loader = () => <div>Loading...</div>;

type SuspenseRouteProps = {
  Component: ComponentType;
};

export function SuspenseRoute({ Component }: SuspenseRouteProps) {
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
}
