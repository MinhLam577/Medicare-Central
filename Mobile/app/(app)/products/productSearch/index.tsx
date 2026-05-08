import { getAllBrands } from '@/apis/brand'
import { getProductsByCategoryIdApi } from '@/apis/product'
import Button from '@/components/button/Button'
import ProductCard from '@/components/card/productCard/ProductCard'
import HorizontalRule from '@/components/horizontalRule/HorizontalRule'
import Input from '@/components/input/Input'
import Row from '@/components/row/Row'
import SearchBox from '@/components/searchBox/SearchBox'
import Space from '@/components/space/Space'
import ThemeText from '@/components/themeText/ThemeText'
import ThemeView from '@/components/themeView/ThemeView'
import useDebounce from '@/hooks/useDebounce'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Brand } from '@/type/brandType'
import { ProductType } from '@/type/productType'
import { isTablet } from '@/utils/isTablet'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Href, router } from 'expo-router'
import { ArrowDown2, ArrowUp2, Back, DocumentFilter } from 'iconsax-react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, View } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'

const ProductSearch = () => {
    const background = useThemeColor({}, "background")
    const text = useThemeColor({}, "text")
    let width = Dimensions.get('screen').width - 16
    const primaryColor = useThemeColor({}, 'primary')
    const textColor = useThemeColor({}, 'text')

    const [search, setSearch] = React.useState('')
    const searchDebounce = useDebounce(search, 500)
    const [products, setProducts] = React.useState<ProductType[]>([])
    const [page, setPage] = React.useState(1)
    const [sortlatest, setSortLatest] = useState(true);
    const screenWidth = Dimensions.get('screen').width - 16

    const fetchOrders = async () => {
        // if (searchDebounce === '') {
        //     return
        // }

        const rs = await getProductsByCategoryIdApi(
            undefined,
            page,
            8,
            'product_price',
            sortlatest,
            minimumPrice ?? undefined,
            maximumPrice ?? undefined,
            selectedBrand.map((item) => item.brand_name),
            searchDebounce === '' ? undefined : searchDebounce
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

    const snapPoints = useMemo(() => ["92%"], []);
    const [minimumPrice, setMinimumPrice] = React.useState<number | null>(null);
    const [maximumPrice, setMaximumPrice] = React.useState<number | null>(null);
    const [selectedRangePrice, setSelectedRangePrice] = React.useState<'-100' | '100-300' | '300-500' | '-500' | null>(null);

    const [selectedBrand, setSelectedBrand] = React.useState<Brand[]>([]);
    const [brands, setBrands] = React.useState<Brand[]>([]);
    const [moreBrands, setMoreBrands] = React.useState<boolean>(false);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenBottomSheet = async () => {
        bottomSheetRef.current?.snapToIndex(1);
    };

    useEffect(() => {
        (async () => {
            const rs = await getAllBrands();
            setBrands(rs.data ?? []);
        })()
    }, [])
    useEffect(() => {
        (async () => {
            fetchOrders();
        })()
    }, [page])

    useEffect(() => {
        setPage(1);
        setProducts([]);
        fetchOrders()
    }, [searchDebounce, sortlatest])

    useEffect(() => {
        switch (selectedRangePrice) {
            case '-100':
                setMinimumPrice(null);
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
        <ThemeView>
            <Row
                style={{
                    justifyContent: "flex-start",
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
                    placeholder="Search"
                    type='text'
                    value={search}
                    onChangeText={(text) => {
                        setSearch(text);
                    }}
                />
                <Button
                    variant="circle"
                    icon={<DocumentFilter size={20} color={text} />}
                    onPress={() => {
                        handleOpenBottomSheet();
                    }}
                    style={{
                        paddingHorizontal: 16,
                    }}
                />
            </Row>
            <Space size={{ height: 8, width: 0 }} />
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
                            backgroundColor: useThemeColor(
                                {},
                                "background"
                            ),
                            padding: 16,
                        }}
                        justifyContent="space-between"
                    >
                        <ThemeText text="Search Filter" type="title" />
                    </Row>
                    <ThemeView
                        style={{
                            backgroundColor: useThemeColor({}, "background"),
                            padding: 16,
                            paddingHorizontal: 16
                        }}
                    >
                        <Row justifyContent='space-between'>
                            <ThemeText type="medium" text="Range Price" style={{
                                fontWeight: 'bold',
                            }} />
                            <Row>
                                <Button
                                    variant="link"
                                    color="text"
                                    onPress={() => {
                                        setSortLatest(!sortlatest);
                                    }}
                                    icon={
                                        !sortlatest ? (
                                            <ArrowUp2
                                                size={16}
                                                color={useThemeColor({}, "text")}
                                            />
                                        ) : (
                                            <ArrowDown2
                                                size={16}
                                                color={useThemeColor({}, "text")}
                                            />
                                        )
                                    }
                                    style={{
                                        paddingHorizontal: 8,
                                        paddingVertical: 8,
                                    }}
                                    textStyles={{
                                        color: useThemeColor({}, "primary"),
                                    }}
                                    text={'Sort by price'}
                                />
                            </Row>
                        </Row>
                        <Space size={{ height: 16, width: 0 }} />
                        <Row>
                            <Input
                                type='number'
                                placeholder="Min"
                                value={minimumPrice !== null ? minimumPrice.toString() : ''}
                                onChangeText={(text) => {
                                    if (text === '') {
                                        setMinimumPrice(null)
                                        return
                                    }
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
                                type='number'
                                placeholder="Max"
                                value={maximumPrice !== null ? maximumPrice.toString() : ''}
                                onChangeText={(text) => {
                                    if (text === '') {
                                        setMaximumPrice(null)
                                        return
                                    }
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
                                        selectedRangePrice === '-100' ?
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
                                        selectedRangePrice === '100-300' ?
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
                                        selectedRangePrice === '-500' ?
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
                        paddingHorizontal: 16
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
                                    />
                                ) : (
                                    <Button
                                        variant="link"
                                        text="Show more"
                                        onPress={() => {
                                            setMoreBrands(true);
                                        }}
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
                                {brands.slice(0, moreBrands ? -1 : 12).map((brand) => {
                                    return (
                                        (
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
                                                        textColor,
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
                                                    borderWidth: 1,
                                                }}
                                            />
                                        )
                                    )
                                })}
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
    )
}

export default ProductSearch