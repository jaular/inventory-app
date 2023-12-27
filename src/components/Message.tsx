type Props = {
  title: string;
};

const Message = ({ title }: Props) => {
  return (
    <div className="flex min-h-[65vh] items-center justify-center">
      <p className="text-lg font-medium md:text-2xl">{title}</p>
    </div>
  );
};

export default Message;
