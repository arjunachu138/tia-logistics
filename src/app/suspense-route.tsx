import { Suspense, type ComponentType } from "react";
import { PageLoader } from "../components/common-loader/PageLoader";

type SuspenseRouteProps = {
  Component: ComponentType;
};

export function SuspenseRoute({ Component }: SuspenseRouteProps) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}
