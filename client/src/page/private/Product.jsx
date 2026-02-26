import { useEffect } from "react";
import { useApi } from "../../hooks/useAPi";

const Product = () => {
  const { callApi } = useApi();

  const getProducts = async () => {
    try {
      const res = await callApi("GET", "/products", {});
      console.log(res);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return <>This is product page</>;
};

export default Product;
