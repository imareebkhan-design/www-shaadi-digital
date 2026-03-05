interface Props {
  photoUrl: string | null;
  brideName: string;
  groomName: string;
}

const InvitePhoto = ({ photoUrl, brideName, groomName }: Props) => {
  if (!photoUrl) return null;

  return (
    <section className="py-12 px-6 bg-card">
      <div className="max-w-md mx-auto">
        <img
          src={photoUrl}
          alt={`${brideName} & ${groomName}`}
          className="w-full aspect-[4/3] object-cover border-4 border-secondary/20"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default InvitePhoto;
