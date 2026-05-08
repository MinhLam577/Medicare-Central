import { getProductByIdApi } from "@/apis/product";
import Badge from "@/components/badge/Badge";
import Button from "@/components/button/Button";
import Row from "@/components/row/Row";
import SearchBox from "@/components/searchBox/SearchBox";
import ThemeText from "@/components/themeText/ThemeText";
import ThemeView from "@/components/themeView/ThemeView";
import { CartContext } from "@/context/cart";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ProductType } from "@/type/productType";
import { router, useLocalSearchParams } from "expo-router";
import { Back, Notification, ShoppingCart } from "iconsax-react-native";
import React, { useContext, useEffect, useRef } from "react";
import { Dimensions, ScrollView } from "react-native";
import RenderHTML from "react-native-render-html";

const Product = () => {
    const { productId } = useLocalSearchParams<{
        productId: string;
    }>();
    let screenWidth = Dimensions.get('screen').width - 32;
    const [product, setProduct] = React.useState<ProductType>();

    useEffect(() => {
        (async () => {
            try {
                const product = await getProductByIdApi(Number(productId));
                if (product.data.product_images.length === 0) {
                    product.data.product_images.push(
                        "../../../../assets/images"
                    );
                }
                setProduct(product.data);
            } catch (error: any) {
                console.log(error);
            }
        })();
    }, [productId]);

    return (
        <ThemeView
            style={{
                position: "relative",
            }}
        >
            {/* // Header ------------------- */}
            <Row
                style={{
                    justifyContent: "flex-start",
                    backgroundColor: useThemeColor({}, "background"),
                    alignItems: "center",
                }}
            >
                <Button
                    variant="circle"
                    icon={<Back size={20} color={useThemeColor({}, "text")} />}
                    onPress={() => {
                        router.back();
                    }}
                />
                <ThemeText text={product?.product_name} type="title" ellipsizeMode="tail" numOfLines={1} 
                    style={{
                        width: screenWidth - 48
                    }}
                />
            </Row>
            {/* // Header ------------------- */}
            <ScrollView>
                <ThemeView>
                    <RenderHTML
                        source={{
                            html: product?.product_description || "",
                        }}
                        contentWidth={screenWidth}
                    />
                </ThemeView>
            </ScrollView>
        </ThemeView>
    );
};

export default Product;
