import { isOlderThanOneMonth } from "../../molecules/Gear/Gear";

type Props = {
  name: string;
  value: number;
  lastModifiedDate: Date; // Is used to know if the input is outdated, call isOlderThanOneMonth to know if it is outdated
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * This component is used to display the input,
 * if the input is outdated, it will be displayed in red
 * @returns
 */
export function OutdatedInput(props: Props) {
  const { name, value, onChange, lastModifiedDate } = props;
  const isOudated = isOlderThanOneMonth(lastModifiedDate);
  return (
    <input
      type="number"
      name={name}
      onBlur={onChange}
      defaultValue={value}
      style={{
        color: isOudated ? "red" : "black",
      }}
    ></input>
  );
}
