import { useEffect, useState } from "react";
import HangoutCard from "./HangoutCard";
import { hangoutsApi, type Hangout, type GetHangoutsParams } from "../../api/ApiClient";
import { Loader2 } from "lucide-react";

interface Props {
  isAuthenticated?: boolean;
  filters?: GetHangoutsParams;
}

const HangoutList = ({ isAuthenticated, filters = {} }: Props) => {
  const [hangouts, setHangouts] = useState<Hangout[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res: any = await hangoutsApi.getAll(filters);
        setHangouts(res.hangouts || []);
        console.log("response from GET ALL: ",res.hangouts);
        
      } catch (e: any) {
        setError(e.message || "Failed to load hangouts");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [JSON.stringify(filters)]);

  if (loading) return (
    <div className="hc-state">
      <Loader2 size={32} className="hc-spinner" />
      <p>Finding hangouts near you…</p>
    </div>
  );

  if (error) return (
    <div className="hc-state hc-state-error">
      <p>⚠️ {error}</p>
    </div>
  );

  if (!hangouts.length) return (
    <div className="hc-state">
      <p>No hangouts found. Be the first to create one!</p>
    </div>
  );

  return (
    <section className="hangout-list">
      {hangouts.map((item) => (
        <HangoutCard
          key={item._id}
          data={item}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </section>
  );
};

export default HangoutList;