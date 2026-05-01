import { SlideLayout } from "../SlideLayout";
import { Link } from "react-router-dom";

export default function Closing() {
  return (
    <SlideLayout chapter="Closing" title="Three things to take with you"
      subtitle="If you remember nothing else from this deck, remember these.">
      <div className="mt-10 grid grid-cols-3 gap-6">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-5xl font-semibold text-primary mb-3">1</div>
          <div className="text-xl font-medium mb-2">The grammar is closed</div>
          <p className="text-base text-muted-foreground">Twelve keys, no explicit OR, one EBNF, twelve normative test vectors. Every parser passes the same table.</p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-5xl font-semibold text-primary mb-3">2</div>
          <div className="text-xl font-medium mb-2">Ranking is deterministic</div>
          <p className="text-base text-muted-foreground">Five buckets by floor(Score/20), UpdatedAt-then-OwnerId tiebreak. Same query + snapshot → byte-identical order. Forever.</p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="text-5xl font-semibold text-primary mb-3">3</div>
          <div className="text-xl font-medium mb-2">No client-side re-rank</div>
          <p className="text-base text-muted-foreground">FE renders server order verbatim. Cross-DB joins forbidden. SSE never re-triggers /search. The 250-cap viewport is a hard wall.</p>
        </div>
      </div>
      <div className="mt-12 text-center text-base text-muted-foreground">
        Live reference impl at{" "}
        <Link to="/search-sim" className="text-foreground underline">/search-sim</Link>
        {" · "}deck index at <Link to="/" className="text-foreground underline">/</Link>
      </div>
    </SlideLayout>
  );
}
