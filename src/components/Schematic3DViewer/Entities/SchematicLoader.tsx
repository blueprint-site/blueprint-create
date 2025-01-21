import { useSchematic } from "@/hooks/useSchematic";
import { ChangeEvent } from "react";
import { Card, Form } from "react-bootstrap";

export function SchematicLoader({ className }: { className: string }) {
  const { setFile, loading } = useSchematic();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Card className={className}>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload your schematic</Form.Label>
        <Form.Control type="file" accept=".nbt" onChange={handleOnChange} />
      </Form.Group>
      {loading && <div>Loading...</div>}
    </Card>
  );
}
