import EPSForm from "../EPSForm";

export default function EPSFormDemo() {
  return (
    <div>
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border p-3">
          <div className="text-sm font-medium text-slate-800 mb-1">Vista Demo</div>
          <div className="text-xs text-slate-600">Formulario EPS independiente para revisión</div>
        </div>
      </div>
      <EPSForm />
    </div>
  );
}
