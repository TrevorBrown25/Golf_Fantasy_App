import { notFound } from 'next/navigation';
import DraftCenter from './DraftCenter';
import { weeksData, ownersData, golfersData } from '@/lib/data';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return weeksData.map((week) => ({ id: week.id }));
}

export default function WeekPage({ params }: Props) {
  const week = weeksData.find((entry) => entry.id === params.id);
  if (!week) {
    notFound();
  }

  const homeOwner = ownersData.find((owner) => owner.id === week.homeOwnerId);
  const awayOwner = ownersData.find((owner) => owner.id === week.awayOwnerId);

  return (
    <DraftCenter
      week={week}
      homeOwner={homeOwner}
      awayOwner={awayOwner}
      golfers={golfersData.slice(0, 40)}
    />
  );
}
