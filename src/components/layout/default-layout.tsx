const DefaultLayout = ({
  children,
}: React.DialogHTMLAttributes<HTMLDialogElement>) => {
  return <div className="max-w-7xl mx-auto flex gap-x-10 mt-4">{children}</div>;
};

export default DefaultLayout;
