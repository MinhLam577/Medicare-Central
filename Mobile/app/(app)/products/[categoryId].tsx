import { getAllBrands } from "@/apis/brand";
import { getCategoryByIdApi } from "@/apis/category";
import { getProductsByCategoryIdApi } from "@/apis/product";
import Badge from "@/components/badge/Badge";
import BreadCrumb from "@/components/breadCrumb/BreadCrumb";
import Button from "@/components/button/Button";
import CategoryCard from "@/components/card/categoryCard/CategoryCard";
import ProductCard from "@/components/card/productCard/ProductCard";
import Input from "@/components/input/Input";
import Row from "@/components/row/Row";
import Space from "@/components/space/Space";
import ThemeText from "@/components/themeText/ThemeText";
import ThemeView from "@/components/themeView/ThemeView";
import { useAuth } from "@/context/auth";
import { CartContext } from "@/context/cart";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Brand } from "@/type/brandType";
import { CategoryType } from "@/type/categoryType";
import { ProductType } from "@/type/productType";
import { isTablet } from "@/utils/isTablet";
import BottomSheet, {
    BottomSheetScrollView
} from "@gorhom/bottom-sheet";
import { Href, router, useLocalSearchParams } from "expo-router";
import { ArrowDown2, ArrowUp2, Back, DocumentFilter, Notification, ShoppingCart } from "iconsax-react-native";
import React, {
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { Dimensions, FlatList, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const Products = () => {
    const { user } = useAuth()
    const { categoryId } = useLocalSearchParams<{
        categoryId: string;
    }>();
    const screenWidth = Dimensions.get('screen').width
    let width = Dimensions.get('screen').width - 16
    const { cartItems } = useContext(CartContext);

    const primaryColor = useThemeColor({}, "primary");
    const textColor = useThemeColor({}, "text");

    const [activeIndex, setActiveIndex] = React.useState<number>(0);
    const [categories, setCategories] = React.useState<CategoryType[]>([]);
    const [products, setProducts] = React.useState<ProductType[]>([]);
    const [breadCrumbs, setBreadCrumbs] = React.useState<string[]>(['']);

    const [minimumPrice, setMinimumPrice] = React.useState<number | null>(null);
    const [maximumPrice, setMaximumPrice] = React.useState<number | null>(null);
    const [selectedRangePrice, setSelectedRangePrice] = React.useState<'-100' | '100-300' | '300-500' | '-500' | null>(null);

    const [selectedBrand, setSelectedBrand] = React.useState<Brand[]>([]);
    const [brands, setBrands] = React.useState<Brand[]>([]);
    const [moreBrands, setMoreBrands] = React.useState<boolean>(false);

    const snapPoints = useMemo(() => ["92%"], []);
    const [page, setPage] = useState(1);
    const [sortlatest, setSortLatest] = useState(true);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenBottomSheet = async () => {
        bottomSheetRef.current?.snapToIndex(1);

        // Fetch brands
        const brands = await getAllBrands();
        setBrands(brands.data ?? []);
    };

    useEffect(() => {
        (async () => {
            try {
                const category = await getCategoryByIdApi(categoryId);
                setCategories(category.data?.children ?? []);

                const categoryF = (category.data?.children ?? [])[0]
                const rs = await getProductsByCategoryIdApi(
                    categoryF.category_name,
                    page,
                    8,
                    'product_price',
                    sortlatest,
                );
                if (rs.data?.data?.length === (0 || undefined)) {
                    return
                }
                if (page === 1) {
                    setProducts(rs.data?.data ?? []);
                } else {
                    setProducts((prev) => [...prev, ...rs.data?.data ?? []]);
                }
            } catch (error: any) {
                Toast.show({
                    text1: "Error",
                    text2: error.messages[0],
                    type: 'error',
                });
            }
        })();
    }, []);

    const fetchOrders = async () => {
        const category = categories[activeIndex];
        console.log(category, 'category')
        const rs = await getProductsByCategoryIdApi(
            category.category_name,
            page,
            8,
            'product_price',
            sortlatest,
            minimumPrice ?? 0,
            maximumPrice ?? 100000,
            selectedBrand.map((item) => item.brand_name)
        );
        if (rs.data?.data?.length === (0 || undefined)) {
            return
        }
        if (rs.data.last_page < page) {
            return
        }
        if (page === 1) {
            setProducts(rs.data?.data ?? []);
        } else {
            setProducts((prev) => [...prev, ...rs.data?.data ?? []]);
        }
    }

    useEffect(() => {
        (async () => {
            fetchOrders();
        })()
    }, [page])

    useEffect(() => {
        setPage(1);
        setProducts([]);
        fetchOrders()
    }, [activeIndex, sortlatest])

    useEffect(() => {
        (async () => {
            const breadCrumbs = [];
            const category = await getCategoryByIdApi(categoryId);
            let temp = category.data;
            while (temp) {
                breadCrumbs.unshift(temp.category_name.toLocaleUpperCase());
                temp = (await getCategoryByIdApi(temp.category_parent_id + ""))
                    .data;
            }
            setBreadCrumbs(breadCrumbs);
        })();
    }, []);

    useEffect(() => {
        switch (selectedRangePrice) {
            case '-100':
                setMinimumPrice(0);
                setMaximumPrice(100000);
                break;
            case '100-300':
                setMinimumPrice(100000);
                setMaximumPrice(300000);
                break;
            case '300-500':
                setMinimumPrice(300000);
                setMaximumPrice(500000);
                break;
            case '-500':
                setMinimumPrice(500000);
                setMaximumPrice(null);
                break;
            default:
                break
        }
    }, [selectedRangePrice])

    return (
        <ThemeView style={{
            position: 'relative',
        }}>
            <Row
                style={{
                    justifyContent: "space-between",
                    backgroundColor: useThemeColor({}, "background"),
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    marginHorizontal: -16,
                }}
            >
                <Button
                    variant="circle"
                    icon={<Back size={20} color={useThemeColor({}, "text")} />}
                    onPress={() => {
                        router.back();
                    }}
                />
                <BreadCrumb breadCrumbs={breadCrumbs} style={{
                    flex: 1,
                }} />
                {
                    user && (
                        <Badge count={cartItems.length}>
                            <Button
                                variant="circle"
                                icon={
                                    <ShoppingCart
                                        size={20}
                                        color={useThemeColor({}, "text")}
                                    />
                                }
                                onPress={() => {
                                    router.navigate("/(app)/cart");
                                }}
                            />
                        </Badge>
                    )
                }
            </Row>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                    flexGrow: 0,
                    marginBottom: 8
                }}
            >
                {categories.map((item, index) => (
                    <CategoryCard
                        key={index}
                        imageUrl={item.category_thumbnail}
                        title={item.category_name}
                        onPress={() => {
                            setActiveIndex(index);
                        }}
                        style={{
                            zIndex: 100,
                            width: isTablet() ? 128 : 100,
                            borderRadius: 8,
                            margin: isTablet() ? 6 : 4,
                            borderWidth: 0.5,
                            borderColor:
                                activeIndex === index
                                    ? primaryColor
                                    : 'transparent',

                        }}
                        imageStyle={{
                            borderRadius: 8,
                            height: isTablet() ? 128 * 0.6 : 100 * 0.6,
                        }}
                        titleStyle={{
                            color:
                                activeIndex === index
                                    ? primaryColor
                                    : textColor,
                        }}
                    />
                ))}
            </ScrollView>
            <FlatList
                onEndReached={() => {
                    console.log("end reached");
                    setPage(page + 1);
                }}
                onEndReachedThreshold={0.8}
                data={products}
                renderItem={({ item, index }) => (
                    <ProductCard
                        key={index}
                        imageUrls={item.product_images ?? []}
                        title={item.product_name}
                        price={
                            item.parent_category_name === "Thuốc không kê đơn"
                                ? item.product_price
                                : undefined
                        }
                        sold={
                            item.parent_category_name === "Thuốc không kê đơn" ? item.product_sold : undefined
                        }
                        onPress={() => {
                            router.navigate(
                                ("/(app)/products/product/" +
                                    item.product_id) as Href
                            );
                        }}
                        style={{
                            width: isTablet() ? width / 3 - 16 : width / 2 - 8,
                            margin: isTablet() ? 8 : 4, flex: 0
                        }}
                    />
                )}
                keyExtractor={(item, index) => item.product_id.toString() + index}
                numColumns={isTablet() ? 3 : 2}
                columnWrapperStyle={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}
                style={{
                    flex: 0,
                    height: "50%",
                }}
            />
            <Row style={{
                backgroundColor: useThemeColor({}, 'itemBackground'),
            }}>
                <Button
                    variant="circle"
                    icon={<DocumentFilter size={20} color={useThemeColor({}, 'text')} />}
                    onPress={() => {
                        handleOpenBottomSheet();
                    }}
                    style={{
                        paddingHorizontal: 16,
                    }}
                />
                <ArrowUp2 size={20} color={useThemeColor({}, 'text')} />
            </Row>
            {/* // BottomSheet  */}
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                index={-1}
                backgroundStyle={{
                    borderColor: useThemeColor({}, "border"),
                    borderWidth: 1,
                }}
            >
                <BottomSheetScrollView
                    style={{
                        backgroundColor: useThemeColor({}, "background"),
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                    }}
                >
                    <Row
                        style={{
                            padding: 16,
                            backgroundColor: useThemeColor(
                                {},
                                "background"
                            ),
                        }}
                        justifyContent="flex-start"
                    >
                        <ThemeText text="Search Filter" type="title" />
                    </Row>
                    <Space size={{ height: 16, width: 0 }} />
                    <ThemeView
                        style={{
                            backgroundColor: useThemeColor({}, "background"),
                            padding: 16,
                        }}
                    >
                        <ThemeText type="medium" text="Range Price" style={{
                            fontWeight: 'bold',
                        }} />
                        <Space size={{ height: 16, width: 0 }} />
                        <Row>
                            <Input
                                placeholder="Min"
                                value={minimumPrice !== null ? minimumPrice.toString() : ''}
                                onChangeText={(text) => {
                                    setMinimumPrice(parseInt(text));
                                }}
                                iconPosition="right"
                                icon={<ThemeText text="VNĐ" type="medium" />}
                                style={{
                                    flex: 1
                                }}
                            />
                            <Space size={{ width: 16, height: 0 }} />
                            <Input

                                placeholder="Max"
                                value={maximumPrice !== null ? maximumPrice.toString() : ''}
                                onChangeText={(text) => {
                                    setMaximumPrice(parseInt(text));
                                }}
                                iconPosition="right"
                                icon={<ThemeText text="VNĐ" type="medium" />}
                                style={{
                                    flex: 1
                                }}
                            />
                        </Row>
                        <Space size={{ height: 16, width: 0 }} />
                        <Row style={{
                        }}>
                            <View style={{
                                flex: 1
                            }}>
                                <Button variant="outline" onPress={() => {
                                    setSelectedRangePrice('-100');
                                }} text="0 đ - 100.000 đ"
                                    key={'-100'}
                                    color={
                                        selectedRangePrice === '300-500' ?
                                            'primary' :
                                            'border'
                                    }
                                    textStyles={{
                                        color: useThemeColor({}, 'text')
                                    }}
                                    style={{
                                        flex: 1,
                                    }}
                                />
                            </View>
                            <Space size={{ width: 16, height: 0 }} />
                            <View style={{
                                flex: 1
                            }}>
                                <Button variant="outline" onPress={() => {
                                    setSelectedRangePrice('100-300');
                                }} text="100.000 đ - 300.000 đ"
                                    key={'100-300'}
                                    color={
                                        selectedRangePrice === '300-500' ?
                                            'primary' :
                                            'border'
                                    }
                                    textStyles={{
                                        color: useThemeColor({}, 'text')
                                    }}
                                    style={{
                                        flex: 1,
                                    }}
                                />
                            </View>
                        </Row>
                        <Space size={{ height: 16, width: 0 }} />
                        <Row style={{
                        }}>
                            <View style={{
                                flex: 1
                            }}>
                                <Button variant="outline" onPress={() => {
                                    setSelectedRangePrice('300-500');
                                }} text="300.000 đ - 500.000 đ"
                                    key={'300-500'}
                                    color={
                                        selectedRangePrice === '300-500' ?
                                            'primary' :
                                            'border'
                                    }
                                    textStyles={{
                                        color: useThemeColor({}, 'text')
                                    }}
                                    style={{
                                        flex: 1,
                                    }}
                                />
                            </View>
                            <Space size={{ width: 16, height: 0 }} />
                            <View style={{
                                flex: 1
                            }}>
                                <Button variant="outline" onPress={() => {
                                    setSelectedRangePrice('-500');
                                }} text="Above 500.000 đ"
                                    key={'-500'}
                                    color={
                                        selectedRangePrice === '300-500' ?
                                            'primary' :
                                            'border'
                                    }
                                    textStyles={{
                                        color: useThemeColor({}, 'text')
                                    }}
                                    style={{
                                        flex: 1,
                                    }}
                                />
                            </View>
                        </Row>


                    </ThemeView>
                    <Space size={{ height: 16, width: 0 }} />
                    <ThemeView style={{
                        backgroundColor: useThemeColor({}, 'background'),
                        padding: 16,
                    }}>
                        <Row justifyContent="space-between">
                            <ThemeText type="medium" text="Brand" style={{
                                fontWeight: 'bold',
                            }} />
                            {
                                moreBrands ? (
                                    <Button
                                        variant="link"
                                        text="Show less"
                                        onPress={() => {
                                            setMoreBrands(false);
                                        }}
                                        icon={<ArrowUp2 size={20} color={useThemeColor({}, 'primary')} />}
                                        iconPosition="right"
                                    />
                                ) : (
                                    <Button
                                        variant="link"
                                        text="Show more"
                                        onPress={() => {
                                            setMoreBrands(true);
                                        }}
                                        icon={<ArrowDown2 size={20} color={useThemeColor({}, 'primary')} />}
                                        iconPosition="right"
                                    />
                                )
                            }
                        </Row>
                        <Space size={{ height: 16, width: 0 }} />
                        <ScrollView
                            style={{
                                maxHeight: screenWidth * 0.6,

                            }}>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                {brands.slice(0, moreBrands ? -1 : 12).map((brand) => (
                                    <Button
                                        variant="outline"
                                        text={brand.brand_name}
                                        key={brand.brand_id}
                                        color={
                                            selectedBrand.includes(brand) ?
                                                'primary' :
                                                'border'
                                        }
                                        textStyles={{
                                            color: selectedBrand.includes(brand) ?
                                                primaryColor :
                                                textColor
                                        }}
                                        onPress={() => {
                                            if (selectedBrand.includes(brand)) {
                                                setSelectedBrand(selectedBrand.filter((item) => item !== brand));
                                            } else {
                                                setSelectedBrand([...selectedBrand, brand]);
                                            }
                                        }}
                                        style={{
                                            marginBottom: 8,
                                            marginRight: 8,
                                            borderWidth: 1
                                        }}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    </ThemeView>
                    <Space size={{ height: 16, width: 0 }} />
                    <Row style={{
                        padding: 16,
                        backgroundColor: useThemeColor({}, 'background'),
                    }}>
                        <View style={{
                            width: '50%',
                        }}>
                            <Button
                                variant="fill"
                                text="Reset Filter"
                                textStyles={{
                                    color: useThemeColor({}, 'text'),
                                }}
                                onPress={() => {
                                    setSelectedBrand([]);
                                    setSelectedRangePrice(null);
                                    setMinimumPrice(null);
                                    setMaximumPrice(null);
                                }}
                                style={{
                                    width: '100%',
                                    backgroundColor: useThemeColor({}, 'itemBackground')
                                }}
                            />
                        </View>
                        <Space size={{ width: 16, height: 0 }} />
                        <View style={{
                            width: '50%',
                        }}>
                            <Button
                                text="Apply"
                                color="primary"
                                onPress={async () => {
                                    setPage(1);
                                    setProducts([]);
                                    fetchOrders();
                                    bottomSheetRef.current?.close();
                                }}
                                style={{
                                    width: '100%',
                                }}
                            />
                        </View>
                    </Row>
                </BottomSheetScrollView>
            </BottomSheet>
            {/* // BottomSheet  */}
        </ThemeView>
    );
};

export default Products;
