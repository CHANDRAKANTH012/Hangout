type Props = {
  children: React.ReactNode;
  className?: string;
};

const GlassCard = ({ children, className = "" }: Props) => {
  return <div className={`glass hover-lift ${className}`}>{children}</div>;
};

export default GlassCard;
