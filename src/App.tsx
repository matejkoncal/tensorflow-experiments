import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";
import { load } from "@tensorflow-models/mobilenet";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream>();
  const [description, setDescription] = useState("Loading...");

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    let intervalId: number;
    (async () => {
      const constraints = { video: true };
      setStream(await navigator.mediaDevices?.getUserMedia(constraints));
      const model = await load();
      intervalId = window.setInterval(async () => {
        if (videoRef.current) {
          const predictions = await model.classify(videoRef.current);
          setDescription(predictions[0].className);
        }
      }, 1000);
    })();
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <div
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50px",
          width: "100vw",
          backgroundColor: "rgba(50, 53, 175, 0.64)",
        }}
      >
        {description}
      </div>
      <video
        data-testid="preview-video"
        playsInline
        ref={videoRef}
        width="100%"
        height="100%"
        autoPlay
        muted
      />
    </div>
  );
}

export default App;
