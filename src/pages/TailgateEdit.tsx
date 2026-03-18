import { useParams } from "react-router-dom";
import AppShell from "../components/AppShell";

export default function TailgateEdit() {
  const { id } = useParams();

  return (
    <AppShell header={<div className="simple-header"><h1>Edit Tailgate</h1></div>}>
      <section className="placeholder-card">
        <h2>Editing {id}</h2>
        <p>This page will load the edit form for the selected tailgate.</p>
      </section>
    </AppShell>
  );
}
