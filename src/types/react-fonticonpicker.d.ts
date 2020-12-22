declare module "@fonticonpicker/react-fonticonpicker" {
  interface Props {
    onChange(value): void;
    value: string | number | (string | number)[];
    icons: string[] | Record<string, string[]>;
    search?: string[] | Record<string, string[]>;
    showSearch?: boolean;
  }

  const FontIconPicker = (props: Props): JSX.Element => {};

  export default FontIconPicker;
}
