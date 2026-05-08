import { getAllCategoriesApi } from '@/apis/category';
import { getNewestProductsApi, getTopSellingProductsApi } from '@/apis/product';
import BannerProduct from '@/components/bannerProduct/BannerProduct';
import CategoryCard from '@/components/card/categoryCard/CategoryCard';
import ProductCard from '@/components/card/productCard/ProductCard';
import DotActive from '@/components/dotActive/DotActive';
import Header from '@/components/header/Header';
import Row from '@/components/row/Row';
import SearchBox from '@/components/searchBox/SearchBox';
import Space from '@/components/space/Space';
import ThemeText from '@/components/themeText/ThemeText';
import ThemeView from '@/components/themeView/ThemeView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CategoryType } from '@/type/categoryType';
import { ProductType } from '@/type/productType';
import { isTablet } from '@/utils/isTablet';
import { Href, router } from 'expo-router';
import { SearchNormal } from 'iconsax-react-native';
import React, { useEffect } from 'react';
import { Image, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';

const Home = () => {
    const { width } = useWindowDimensions();

    const [categories, setCategories] = React.useState<CategoryType[]>([]);
    const [bannerImages, setBannerImages] = React.useState(() => [
        Image.resolveAssetSource(require('../../../assets/images/banner1.jpg')).uri,
        Image.resolveAssetSource(require('../../../assets/images/banner2.jpg')).uri,
        Image.resolveAssetSource(require('../../../assets/images/banner4.jpg')).uri,
    ]);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [topSellingProducts, setTopSellingProducts] = React.useState<{
        current_page: number;
        data: ProductType[];
    }>();
    const [newestProducts, setNewestProducts] = React.useState<{
        current_page: number;
        data: ProductType[];
    }>();


    useEffect(() => {
        (async () => {
            try {
                // await AsyncStorage.setItem('user', JSON.stringify(cartItems))
                const rs = await getAllCategoriesApi();
                setCategories(rs.data);
                const topSellingProducts = await getTopSellingProductsApi();
                setTopSellingProducts(topSellingProducts.data);
                const newestProducts = await getNewestProductsApi();
                setNewestProducts(newestProducts.data);
            } catch (error: any) {
                Toast.show({
                    text1: error.messages[0],
                    type: 'error',
                });
            }
        })();
    }, []);

    return (
        <ThemeView>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Header type='main' />
                <Space size={{ width: 0, height: 8 }} />
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
                <Space size={{ width: 0, height: 16 }} />
                <Carousel
                    loop
                    width={width - 16}
                    height={width / 2}
                    autoPlay
                    autoPlayInterval={3000}
                    data={bannerImages}
                    scrollAnimationDuration={1000}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    renderItem={item => (
                        <View
                            style={{
                                justifyContent: 'center',
                                borderRadius: 8,
                                marginHorizontal: 2,
                            }}
                        >
                            <Image
                                source={{
                                    uri: item.item
                                }}
                                style={{
                                    maxWidth: '100%',
                                    height: '100%',
                                    resizeMode: 'cover',
                                    borderRadius: 8,
                                }}
                            />
                        </View>
                    )}
                />
                <DotActive
                    numberOfDots={bannerImages.length}
                    activeIndex={activeIndex}
                />
                <ThemeText
                    text='All Featured'
                    type='title'
                    style={{
                        marginLeft: 8
                    }}
                />
                <Space size={{ width: 0, height: 8 }} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                        flexGrow: 0,
                    }}
                >
                    <Row>
                        {categories.map((item) => (
                            <CategoryCard
                                type='circle'
                                key={item.category_id}
                                imageUrl={item.category_thumbnail}
                                title={item.category_name}
                                onPress={() => {
                                    console.log(item)
                                    if (item.category_type === 'medicine')
                                        router.navigate(
                                            ("/(tabs)/categories/medicine/" +
                                                item.category_id) as Href
                                        );
                                    if (item.category_type === 'disease')
                                        router.navigate(
                                            ("/(tabs)/categories/disease" as Href))
                                }}
                                style={{
                                    width: ((width - 32) / 3) > 128 ? 128 : (width - 32) / 3,
                                    marginRight: 8
                                }}
                            />
                        ))}
                    </Row>
                </ScrollView>

                <Space size={{ width: 0, height: 16 }} />
                <BannerProduct
                    title='Top Selling'
                />
                <Space size={{ width: 0, height: isTablet() ? 16 : 8 }} />
                <ScrollView
                    style={{
                        height: isTablet() ? 600 : 400,
                    }}
                    showsHorizontalScrollIndicator={true}
                    contentContainerStyle={{
                        justifyContent: 'center',
                    }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', display: 'flex', justifyContent: 'center' }}>
                        {topSellingProducts &&
                            topSellingProducts.data.map((item, i) => {
                                return (
                                    <ProductCard
                                        key={item.product_id}
                                        imageUrls={[item.product_images ? item.product_images[0] : 'https://cdni.iconscout.com/illustration/premium/thumb/product-is-empty-illustration-download-in-svg-png-gif-file-formats--no-records-list-record-emply-data-user-interface-pack-design-development-illustrations-6430770.png?f=webp']}
                                        title={item.product_name}
                                        onPress={() => {
                                            router.navigate(
                                                ("/(app)/products/product/" +
                                                    item.product_id) as Href
                                            );
                                        }}
                                        style={{
                                            width: (width - 32) / 2 > 242 ? 242 : (width - 32) / 2,
                                            marginRight: isTablet() ? 16 : 8,
                                            marginBottom: isTablet() ? 16 : 8,
                                        }}
                                        price={item.product_price}
                                        sold={item.product_sold}
                                    />
                                );
                            })
                        }
                    </View>
                </ScrollView>
                <Space size={{ width: 0, height: 16 }} />
                <BannerProduct
                    title='Newest Products'
                />
                <Space size={{ width: 0, height: isTablet() ? 16 : 8 }} />
                <ScrollView
                    style={{
                        height: isTablet() ? 600 : 400,
                    }}
                    showsHorizontalScrollIndicator={true}
                    contentContainerStyle={{
                        justifyContent: 'center',
                    }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', display: 'flex', justifyContent: 'center' }}>
                        {newestProducts &&
                            newestProducts.data.map((item, i) => {
                                return (
                                    <ProductCard
                                        key={item.product_id}
                                        imageUrls={[item.product_images ? item.product_images[0] : 'https://cdni.iconscout.com/illustration/premium/thumb/product-is-empty-illustration-download-in-svg-png-gif-file-formats--no-records-list-record-emply-data-user-interface-pack-design-development-illustrations-6430770.png?f=webp']}
                                        title={item.product_name}
                                        onPress={() => {
                                            router.navigate(
                                                ("/(app)/products/product/" +
                                                    item.product_id) as Href
                                            );
                                        }}
                                        style={{
                                            width: (width - 32) / 2 > 242 ? 242 : (width - 32) / 2,
                                            marginRight: isTablet() ? 16 : 8,
                                            marginBottom: isTablet() ? 16 : 8,
                                        }}
                                        price={item.product_price}
                                        sold={item.product_sold}
                                    />
                                );
                            })
                        }
                    </View>
                </ScrollView>
                <Space size={{ width: 0, height: 16 }} />
            </ScrollView>
        </ThemeView>
    )
}

export default Home