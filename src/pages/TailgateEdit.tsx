import { Navigate, useParams } from "react-router-dom";

export default function TailgateEdit() {
  const { id } = useParams();
  if (!id) {
    return <Navigate to="/dashboard" replace />;
  }

  const encodedId = id ? encodeURIComponent(id) : "";

  return <Navigate to={`/tailgates/${encodedId}?edit=event`} replace />;
}
