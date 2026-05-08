import { getProductByIdApi, getReviewProductApi } from "@/apis/product";
import Badge from "@/components/badge/Badge";
import Button from "@/components/button/Button";
import CartCard from "@/components/card/cartCard/CartCard";
import ReviewCard from "@/components/card/reviewCard/ReviewCard";
import EmptyData from "@/components/emptyData/EmptyData";
import HorizontalRule from "@/components/horizontalRule/HorizontalRule";
import Row from "@/components/row/Row";
import SearchBox from "@/components/searchBox/SearchBox";
import Space from "@/components/space/Space";
import Tag from "@/components/tag/Tag";
import ThemeText from "@/components/themeText/ThemeText";
import ThemeView from "@/components/themeView/ThemeView";
import { useAuth } from "@/context/auth";
import { CartContext } from "@/context/cart";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ProductType } from "@/type/productType";
import { Review } from "@/type/reviewType";
import { convertPrice } from "@/utils/convertPrice";
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { Href, router, useLocalSearchParams } from "expo-router";
import { Add, ArrowRight2, Back, Minus, Notification, SearchNormal, ShoppingCart, WalletMoney } from "iconsax-react-native";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { ImageViewer, ImageWrapper } from "react-native-reanimated-viewer";
import Toast from "react-native-toast-message";

const Product = () => {
    const { productId } = useLocalSearchParams<{
        productId: string;
    }>();
    const { user } = useAuth()
    let screenWidth = Dimensions.get('screen').width * 3 / 4;
    const itemBackground = useThemeColor({}, "itemBackground");
    const icon = useThemeColor({}, "icon");
    const background = useThemeColor({}, "background");
    const text = useThemeColor({}, "text");
    const primary = useThemeColor({}, "primary");

    const { cartItems, addProductToCart } = useContext(CartContext);

    const [product, setProduct] = React.useState<ProductType>();

    const snapPoints = useMemo(() => ["75 %"], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenBottomSheet = async () => {
        setProductQuantity(1);
        bottomSheetRef.current?.snapToIndex(1);
    };

    const bottomSheetReviewRef = useRef<BottomSheet>(null);
    const handleOpenBottomSheetReview = async () => {
        bottomSheetReviewRef.current?.snapToIndex(1);
    };

    const [review, setReview] = React.useState<Review[]>([]);
    const [reviewPage, setReviewPage] = React.useState(1);

    useEffect(() => {
        (async () => {
            try {
                const product = await getProductByIdApi(Number(productId));
                if (product.data.product_images.length === 1 && product.data.product_images[0] === '' || product.data.product_images.length === 0) {
                    product.data.product_images = [Image.resolveAssetSource(require('../../../../assets/images/unknownImage.png')).uri];
                }
                setProduct(product.data);
            } catch (error: any) {
                console.log(error);
            }
        })();
    }, [productId]);

    useEffect(() => {
        (async () => {
            try {
                const review = await getReviewProductApi(Number(productId), reviewPage, 3);
                setReview((prev) => [...prev, ...review.data.data]);
            } catch (error: any) {
                console.log(error);
            }
        })()
    }, [reviewPage])

    const [productQuantity, setProductQuantity] = React.useState(1);

    const imageRef = useRef(null);

    return (
        <ThemeView
            style={{
                position: "relative",
            }}
        >
            {/* // Header ------------------- */}
            <Row
                style={{
                    justifyContent: "space-between",
                    backgroundColor: background,
                    paddingVertical: 8,
                    marginHorizontal: 8,
                    alignItems: "center",
                }}
            >
                <Button
                    variant="circle"
                    icon={<Back size={20} color={text} />}
                    onPress={() => {
                        router.back();
                    }}
                />
                <SearchBox
                    placeholder='Search for anything...'
                    icon={
                        <SearchNormal
                            size={20}
                            color={useThemeColor({}, "text")}
                        />
                    }
                    type='button'
                    onPress={() => {
                        router.navigate("/(app)/products/productSearch")
                    }}
                />
                <Space size={{ width: 16, height: 0 }} />
                {
                    user ? (
                        <Badge count={cartItems.length}>
                            <Button
                                variant="circle"
                                icon={
                                    <ShoppingCart
                                        size={20}
                                        color={text}
                                    />
                                }
                                onPress={() => {
                                    router.navigate("/(app)/cart");
                                }}
                            />
                        </Badge>
                    ) : (
                        <Button
                            variant="fill"
                            onPress={() => {
                                router.navigate("/(auth)/signIn");
                            }}
                            text='Sign In'
                            style={{
                                paddingVertical: 8
                            }}
                        />
                    )
                }
            </Row>
            {/* // Header ------------------- */}
            <ScrollView
                style={{
                    marginBottom: user ? 70 : 0,
                    width: "100%",
                }}
                showsVerticalScrollIndicator={false}
            >
                <ImageViewer
                    ref={imageRef}
                    data={
                        product?.product_images?.map((el) => ({
                            key: el,
                            source: { uri: el },
                        })) ?? []
                    }
                />
                <View style={{ flexDirection: "row", height: screenWidth, width: '100%' }}>
                    <ImageWrapper
                        key={product?.product_images?.[0] ?? "none"}
                        viewerRef={imageRef}
                        index={0}
                        source={{
                            uri: product?.product_images?.[0] ?? Image.resolveAssetSource(require('../../../../assets/images/unknownImage.png')).uri,
                        }}
                        style={{
                        }}
                    >
                        <Image
                            source={{
                                uri: product?.product_images?.[0] ?? Image.resolveAssetSource(require('../../../../assets/images/unknownImage.png')).uri,
                            }}
                            style={{
                                width: "100%",
                                aspectRatio: 1,
                                height: screenWidth,
                            }}
                        />
                    </ImageWrapper>
                    <Space size={{ height: 0, width: 4 }} />
                    <ScrollView style={{ height: "100%" }}>
                        {product?.product_images?.map((el, index) => (
                            <ImageWrapper
                                key={el}
                                viewerRef={imageRef}
                                index={index}
                                source={{
                                    uri: el,
                                }}
                            >

                                <Image
                                    source={{
                                        uri: el,
                                    }}
                                    style={{
                                        width: "100%",
                                        aspectRatio: 1,
                                        marginBottom: 4,

                                    }}
                                />
                            </ImageWrapper>
                        ))}
                    </ScrollView>
                    <Space size={{ height: 0, width: 4 }} />
                </View>

                <ThemeView>
                    <ThemeText type="title" text={product?.product_name}
                        numOfLines={10}
                    />
                    <Space size={{ height: 16, width: 0 }} />
                    <Row justifyContent="space-between">
                        <ThemeText
                            type="link"
                            text={`Brand: ${product?.brand_name}`}
                        />
                        {
                            product?.parent_category_name === 'Thuốc không kê đơn' && (
                                <Row justifyContent="flex-end">
                                    <WalletMoney
                                        size={20}
                                        color={icon}
                                    />
                                    <Space size={{ width: 8, height: 0 }} />
                                    <ThemeText
                                        type="medium"
                                        text={`Sold: ${product?.product_sold} products`}
                                    />
                                </Row>
                            )
                        }
                    </Row>
                    <Space size={{ height: 12, width: 0 }} />
                    {
                        product?.parent_category_name === 'Thuốc không kê đơn' && (
                            <ThemeText
                                type="large"
                                text={`${convertPrice(Number.parseFloat(product?.product_price ?? "0"))} vnđ`}
                                style={{
                                    color: primary,
                                    fontSize: 32,
                                }}
                            />
                        )
                    }
                    <Space size={{ height: 8, width: 0 }} />
                    <ThemeText
                        type="medium"
                        text={`Price includes all taxes. Shipping fees and other costs (if applicable) will be displayed when ordering.`}
                        style={{
                            color: icon,
                            fontSize: 12,
                        }}
                        numOfLines={10}
                    />
                </ThemeView>
                {
                    product?.product_package &&
                    (<>
                        <Space size={{ height: 16, width: 0 }} />
                        <ThemeView
                            style={{
                                backgroundColor: background,
                                padding: 16,
                            }}
                        >
                            <ThemeText type="title" text="Product Classification" />
                            <Space size={{ height: 16, width: 0 }} />
                            <Tag
                                text={product?.product_package ?? "Box"}
                                type="primary"
                            />
                        </ThemeView></>)
                }
                <Space size={{ height: 16, width: 0 }} />
                <ThemeView
                    style={{
                        backgroundColor: background,
                        padding: 16,
                    }}
                >
                    <Row justifyContent="space-between">
                        <ThemeText type="title" text="Description" />
                        <Row>
                            <ThemeText type="link" text="See more"
                                onPress={() => {
                                    router.navigate(
                                        `/(app)/products/productDetail/${product?.product_id}` as Href
                                    )
                                }}
                            />
                            <Space size={{ width: 8, height: 0 }} />
                            <ArrowRight2 size={16} color={primary} />
                        </Row>
                    </Row>
                    {
                        product?.category_name && (
                            <>
                                <Space size={{ height: 16, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={`Category`}
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                />
                                <Space size={{ height: 8, width: 0 }} />
                                <ThemeText type="medium" text={product?.category_name} /></>
                        )
                    }
                    {
                        product?.product_ingredients && (
                            <>
                                <Space size={{ height: 16, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={`Intergredient`}
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                />
                                <Space size={{ height: 8, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={product?.product_ingredients ?? "..."}
                                /></>
                        )
                    }
                    {
                        product?.product_uses && (
                            <>
                                <Space size={{ height: 16, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={`Uses`}
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                />
                                <Space size={{ height: 8, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={product?.product_uses ?? "..."}
                                />
                            </>
                        )
                    }
                    {
                        product?.dosage_form && (
                            <>
                                <Space size={{ height: 16, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={`Dosage form`}
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                />
                                <Space size={{ height: 8, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={product?.dosage_form ?? "..."}
                                />
                            </>
                        )
                    }
                    {
                        product?.manufacturer && (
                            <>
                                <Space size={{ height: 16, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={`Manufacturer`}
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                />
                                <Space size={{ height: 8, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={product?.manufacturer ?? "..."}
                                />
                            </>
                        )
                    }
                    {
                        product?.specification && (
                            <>
                                <Space size={{ height: 16, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={`Specification`}
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                />
                                <Space size={{ height: 8, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={product?.specification ?? "..."}
                                />
                            </>
                        )
                    }
                    {
                        product?.product_notes && (
                            <>
                                <Space size={{ height: 16, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={`Product notes`}
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                />
                                <Space size={{ height: 8, width: 0 }} />
                                <ThemeText
                                    type="medium"
                                    text={product?.product_notes ?? "..."}
                                />
                            </>
                        )
                    }
                </ThemeView>
                <ThemeView>
                    {
                        review.length > 0 && (
                            <Row justifyContent="space-between">
                                <ThemeText type="title" text="Reviews" />
                                <Row>
                                    <ThemeText type="link" text="See more"
                                        onPress={() => {
                                            if (review.length === 0) {
                                                return;
                                            }
                                            handleOpenBottomSheetReview();
                                        }}
                                    />
                                    <Space size={{ width: 8, height: 0 }} />
                                    <ArrowRight2 size={16} color={primary} />
                                </Row>
                            </Row>
                        )
                    }
                    {
                        review.length === 0 && (
                            <><ThemeText type="title" text="Reviews" />
                                <Space size={{ height: 16, width: 0 }} />

                                <ThemeView style={{
                                    backgroundColor: itemBackground,
                                    borderRadius: 8,
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}>
                                    <EmptyData title="No reviews found" style={{
                                        width: '100%',
                                        alignItems: 'center',
                                    }} />
                                </ThemeView>
                            </>
                        )
                    }
                    <Space size={{ height: 16, width: 0 }} />
                    {
                        review?.map((el, index) => (
                            <ReviewCard
                                reviewComment={el.review_comment}
                                reviewImages={el.review_images !== null ? JSON.parse(el.review_images) : []}
                                reviewRating={el.review_rating}
                                userAvatar={el.user_avatar}
                                userFullName={el.user_fullname}
                                reviewCreatedAt={el.review_created_at}

                                style={{
                                    marginBottom: index === review.length - 1 ? 0 : 16,
                                }}
                            />
                        ))
                    }
                </ThemeView>
                <Space size={{ height: 16, width: 0 }} />
            </ScrollView>
            {
                product?.parent_category_name === 'Thuốc không kê đơn' && user && (
                    <Row
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: itemBackground,
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                        }}
                        justifyContent="space-between"
                    >
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <Button
                                variant="outline"
                                color="text"
                                text="Add to cart"
                                onPress={async () => {
                                    try {
                                        if (product?.product_id) {
                                            await addProductToCart(
                                                product.product_id,
                                                1
                                            );

                                            Toast.show({
                                                text1: "Success",
                                                text2: "Product added to cart",
                                                type: 'success',
                                            });
                                        }
                                    } catch (error: any) {
                                        Toast.show({
                                            text1: "Error",
                                            text2: error.messages[0],
                                            type: 'error',
                                        });
                                    }
                                }}
                                style={{
                                    paddingVertical: 12,
                                    borderRadius: 8,
                                    flex: 1,
                                    backgroundColor: background,
                                    borderWidth: 0
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                marginLeft: 16,
                            }}
                        >
                            <Button
                                color="primary"
                                text="Buy now"
                                onPress={() => {
                                    handleOpenBottomSheet();
                                }}
                                style={{
                                    paddingVertical: 12,
                                    flex: 1,
                                }}
                            />
                        </View>
                    </Row>
                )
            }
            {
                product?.parent_category_name === 'Thuốc kê đơn' && user && (
                    <Row
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: itemBackground,
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                        }}
                        justifyContent="space-between"
                    >
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <Button
                                color="primary"
                                text="Consult now"
                                onPress={() => { }}
                                style={{
                                    paddingVertical: 12,
                                    flex: 1,
                                }}
                            />
                        </View>
                    </Row>
                )
            }
            {/* // BottomSheet  */}
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                index={-1}
                backgroundStyle={{
                    borderColor: useThemeColor({}, "text"),
                    borderWidth: 0.5,
                }}
            >
                <BottomSheetScrollView
                    style={{
                        backgroundColor: useThemeColor({}, "background"),
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingHorizontal: 8,
                    }}
                >
                    <View style={{
                        padding: 8,
                    }}>
                        <CartCard
                            type="small"
                            productImage={product?.product_images?.[0] ?? ""}
                            productName={product?.product_name ?? ""}
                            cartPrice={Number(product?.product_price) ?? 0}
                            cartQuantity={product?.product_quantity ?? 0}
                        />
                        <Space size={{ height: 16, width: 0 }} />
                    </View>
                    <HorizontalRule text="Choose quantity" type="normal" />
                    <Space size={{ height: 16, width: 0 }} />
                    <Row justifyContent="space-between" style={{
                        paddingHorizontal: 16
                    }}>
                        <View>
                            <ThemeText text='Total' type='medium' style={{
                                textAlign: 'right',
                                fontWeight: 'bold',
                            }} />
                            <Row>
                                <ThemeText text={
                                    `${convertPrice(Number.parseFloat(product?.product_price ?? "0") * productQuantity)}`
                                } type='medium'
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: 24,
                                        lineHeight: 24,
                                    }}
                                />
                                <Space size={{ height: 0, width: 8 }} />
                                <ThemeText text='VND' type='small' />
                            </Row>
                        </View>
                        <Row>
                            <TouchableOpacity
                                style={{
                                    padding: 8,
                                    borderRadius: 4,
                                    backgroundColor: useThemeColor({}, 'primary'),
                                }}
                                onPress={() => {
                                    if (productQuantity > 1)
                                        setProductQuantity(productQuantity - 1);
                                }}
                            >
                                <Minus size={16} color={useThemeColor({}, 'white')} />
                            </TouchableOpacity>
                            <Space size={{ width: 12, height: 0 }} />
                            <ThemeText text={`${productQuantity}`} type="medium" />
                            <Space size={{ width: 12, height: 0 }} />
                            <TouchableOpacity
                                style={{
                                    padding: 8,
                                    borderRadius: 4,
                                    backgroundColor: useThemeColor({}, 'primary'),
                                }}
                                onPress={() => {
                                    if (productQuantity < (product?.product_quantity ?? 0))
                                        setProductQuantity(productQuantity + 1);
                                }}
                            >
                                <Add size={16} color={useThemeColor({}, 'white')} />
                            </TouchableOpacity>
                        </Row>
                    </Row>
                    <Space size={{ height: 32, width: 0 }} />
                    <ThemeView>
                        <Button
                            color="primary"
                            text="Buy now"
                            onPress={() => {
                                router.navigate(
                                    `/(app)/checkout/checkout/` + JSON.stringify({
                                        product_id: product?.product_id,
                                        quantity: productQuantity,
                                    }) as Href
                                )
                            }}
                        />
                    </ThemeView>
                </BottomSheetScrollView>
            </BottomSheet>
            {/* // BottomSheet  */}
            {/* // BottomSheet  */}
            <BottomSheet
                ref={bottomSheetReviewRef}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                index={-1}
                backgroundStyle={{
                    borderColor: useThemeColor({}, "text"),
                    borderWidth: 0.5,
                }}
            >
                <BottomSheetView
                    style={{
                        backgroundColor: useThemeColor({}, "background"),
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingHorizontal: 8,
                    }}
                >
                    <FlatList
                        data={review}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <ReviewCard
                                reviewComment={item.review_comment}
                                reviewImages={item.review_images !== null ? JSON.parse(item.review_images) : []}
                                reviewRating={item.review_rating}
                                userAvatar={item.user_avatar}
                                userFullName={item.user_fullname}
                                reviewCreatedAt={item.review_created_at}
                                style={{
                                    marginBottom: 16,
                                }}
                            />
                        )}
                        onEndReached={() => {
                            console.log("end reached");
                            setReviewPage(reviewPage + 1);
                        }}
                        onEndReachedThreshold={0.8}
                    />
                </BottomSheetView>
            </BottomSheet>
            {/* // BottomSheet  */}
        </ThemeView>
    );
};

export default Product;
