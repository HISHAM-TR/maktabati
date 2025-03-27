
interface CardStatsProps {
  bookCount: number;
  volumeCount?: number;
}

const CardStats = ({ bookCount, volumeCount = 0 }: CardStatsProps) => {
  return (
    <div className="text-sm text-muted-foreground flex flex-col gap-1">
      <div>{bookCount} {bookCount === 1 ? "كتاب" : "كتب"}</div>
      <div>{volumeCount} {volumeCount === 1 ? "مجلد" : "مجلدات"}</div>
    </div>
  );
};

export default CardStats;
