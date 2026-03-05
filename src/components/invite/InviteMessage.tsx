interface Props {
  message: string | null;
}

const InviteMessage = ({ message }: Props) => {
  if (!message) return null;

  return (
    <section className="py-12 px-6 bg-background">
      <div className="max-w-lg mx-auto text-center">
        <div className="text-secondary text-2xl mb-4">✉</div>
        <p className="font-serif text-lg md:text-xl italic text-foreground/80 leading-relaxed">
          "{message}"
        </p>
        <div className="w-12 h-px bg-secondary mx-auto mt-6" />
      </div>
    </section>
  );
};

export default InviteMessage;
