import { getCategoryByIdApi } from "@/apis/category";
import BreadCrumb from "@/components/breadCrumb/BreadCrumb";
import CategoryCard from "@/components/card/categoryCard/CategoryCard";
import Space from "@/components/space/Space";
import ThemeView from "@/components/themeView/ThemeView";
import { CategoryType } from "@/type/categoryType";
import { isTablet } from "@/utils/isTablet";
import { Href, router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, FlatList } from "react-native";
import Toast from "react-native-toast-message";

const Categories = () => {
    const { categoryId } = useLocalSearchParams<{
        categoryId: string;
    }>();
    let width = Dimensions.get('screen').width - 16

    const [category, setCategory] = React.useState<CategoryType>();
    const [breadCrumbs, setBreadCrumbs] = React.useState<string[]>([]);

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
    }, [categoryId]);

    useEffect(() => {
        (async () => {
            try {
                const rs = await getCategoryByIdApi(categoryId);
                setCategory(rs.data);
            } catch (error: any) {
                Toast.show({
                    type: "Error",
                    text1: error.messages[0],
                });
            }
        })();
    }, []);

    return (
        <ThemeView>
            <BreadCrumb breadCrumbs={breadCrumbs} />
            <Space size={{ height: isTablet() ? 16 : 8, width: 0 }} />
            <FlatList
                data={category?.children}
                columnWrapperStyle={{
                    justifyContent: 'flex-start', alignItems: 'flex-start',
                }}
                renderItem={({ item }) => (
                    <CategoryCard
                        key={item.category_id}
                        imageUrl={item.category_thumbnail}
                        title={item.category_name}
                        onPress={() => {
                            router.setParams({
                                categoryId: item.category_id,
                            });
                            router.navigate(
                                ("/(app)/products/" + item.category_id) as Href
                            );
                        }}
                        style={{
                            width: isTablet() ? width / 3 - 24 : width / 2 - 16,
                            margin: 8,
                            flex: 0,
                        }}
                    />
                )}
                keyExtractor={(item) => item.category_id.toString()}
                numColumns={2}
            />
        </ThemeView>
    );
};

export default Categories;
