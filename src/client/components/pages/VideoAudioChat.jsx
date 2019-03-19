import React, { Suspense } from "react";

const Audio = React.lazy(() => import("../webrtc-api/Audio"));
const Video = React.lazy(() => import("../webrtc-api/Video"));

export default props => {
  return (
    <React.Fragment>
      <Suspense fallback={<div>loading..</div>}>
        {props.video ? <Video {...props} /> : <Audio {...props} />}
      </Suspense>
    </React.Fragment>
  );
};
