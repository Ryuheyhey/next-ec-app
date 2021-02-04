import Client, { Product } from "shopify-buy";
import Layout from "../components/Layout";
import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";

type DetailProps = {
  product?: Product;
  errors?: string;
};

const client = Client.buildClient({
  domain: "nexjs-ecapp-example.myshopify.com", //自分のストアのURLを入力する
  storefrontAccessToken: "6d91994185467f5f31bd11f59b632ea9", //自分のStorefront APIのアクセストークンを入力する
});

const DetailPage = (props: DetailProps) => {
  const { product, errors } = props;
  const [checkoutLink, setCheckoutLink] = useState("");

  useEffect(() => {
    client.checkout.create().then((checkout: any) => {
      const variantsId: any = product?.variants[0].id;
      client.checkout
        .addLineItems(checkout.id, [{ variantId: variantsId, quantity: 1 }])
        .then((checkout: any) => {
          console.log(checkout);
          setCheckoutLink(checkout.webUrl);
          console.log(checkoutLink);
        });
    });
  }, []);

  if (errors) {
    return <p>Error: {props.errors}</p>;
  }
  if (!product) {
    return <p>Error: Product not found</p>;
  }

  return (
    <Layout title={product.title}>
      <div>
        <p>{product.title}</p>
        <img src={product.images[0].src} height={200} />
      </div>
      <Link href={checkoutLink}>
        <button>購入する</button>
      </Link>
    </Layout>
  );
};

export default DetailPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const products: Product[] = await client.product.fetchAll();
  const paths = products.map((product) => ({
    params: {
      id: product.id.toString(),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<DetailProps> = async ({
  params,
}) => {
  try {
    const id = params?.id;
    if (!id) {
      return {
        props: {
          errors: "not found",
        },
      };
    }
    const productRes = await client.product.fetch(id as string);
    const product = JSON.parse(JSON.stringify(productRes));

    return {
      props: {
        product: product,
      },
    };
  } catch (err) {
    return {
      props: {
        errors: "Unexpected error",
      },
    };
  }
};
