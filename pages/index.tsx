import Client, { Product } from "shopify-buy";
import { GetStaticProps } from "next";
import Link from "next/link";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

type IndexProps = {
  products: Product[];
};

const useStyles = makeStyles((theme) => ({
  section: {
    margin: "0 auto",
    maxWidth: "575px",
    position: "relative",
    padding: "0 1rem",
    textAlign: "center",
    width: "100%",
  },
  grid: {
    display: "flex",
    flexFlow: "row wrap",
  },
  root: {
    [theme.breakpoints.down("sm")]: {
      margin: 8,
      width: "calc(50% - 16px)",
    },
    [theme.breakpoints.up("sm")]: {
      margin: 16,
      width: "calc(33.333% - 32px)",
    },
  },
  media: {
    height: 0,
    paddingTop: "100%",
  },
}));

const client = Client.buildClient({
  domain: "nexjs-ecapp-example.myshopify.com", //自分のストアのURLを入力する
  storefrontAccessToken: "6d91994185467f5f31bd11f59b632ea9", //自分のStorefront APIのアクセストークンを入力する
});

const IndexPage: React.FC<IndexProps> = ({ products }) => {
  const classes = useStyles();

  return (
    <section className={classes.section}>
      <div className={classes.grid}>
        {products.map((product) => (
          <Card className={classes.root} key={product.id}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={product.images[0].src}
                title="商品画像"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {product.description}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Link href="/[id]" as={`/${product.id}`}>
                <a>
                  <Button>商品詳細</Button>
                </a>
              </Link>
            </CardActions>
          </Card>
        ))}
      </div>
    </section>

    // <>
    //   <h1>Hello Next.js 👋</h1>
    //   <ul>
    //     {products.map(product => (
    //       <li key={product.id}>
    //         <Link href="/[id]" as={ `/${product.id}`}>
    //           <a>
    //             {product.title}
    //             <img src={product.images[0].src} height={80}/>
    //           </a>
    //         </Link>
    //       </li>
    //       ))}
    //   </ul>
    // </>
  );
};

export default IndexPage;

export const getStaticProps: GetStaticProps = async () => {
  const products: any = await client.product.fetchAll();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};
