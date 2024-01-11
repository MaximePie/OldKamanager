import { useDebugContext } from "../../../contexts/DebugContext";
import styles from "./Debug.module.scss";

export const Debug = () => {
  const { debugMessages } = useDebugContext();
  return (
    <div className={styles.Debug}>
      <pre>{JSON.stringify(debugMessages, null, 2)}</pre>
    </div>
  );
};
