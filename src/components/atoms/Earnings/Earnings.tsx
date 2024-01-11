import classNames from "classnames";
import styles from "./Earnings.module.scss";

type Props = {
  craftingPrice: number;
  currentPrice: number;
};
export const Earnings = ({ craftingPrice, currentPrice }: Props) => {
  const earnings = currentPrice - craftingPrice;
  const EarningsClassName = classNames(styles.income, {
    [styles.positive]: earnings > 20000,
    [styles.yellow]: earnings > 10000 && earnings < 19999,
    [styles.orange]: earnings > 5000 && earnings < 9999,
    [styles.red]: earnings < 4999,
  });
  return (
    <span className={EarningsClassName}>
      + {(currentPrice - craftingPrice).toLocaleString("FR-fr")} k
    </span>
  );
};
