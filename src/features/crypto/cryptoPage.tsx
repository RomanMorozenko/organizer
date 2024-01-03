import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useEffect } from "react";
import { getCoinsList } from "./crypto.reducer";

export const CryptoPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCoinsList({}));
  }, []);

  return <div>Crypto</div>;
};
