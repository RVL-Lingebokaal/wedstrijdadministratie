interface InputProps {
  onChange: () => void;
}

export function Input(props: InputProps) {
  return (
    <input
      className="border-gray-400 border rounded-lg px-2 py-1.5"
      type="text"
      {...props}
    />
  );
}
