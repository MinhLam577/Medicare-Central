import { getAllCategoriesApi } from "@/apis/category";
import CategoryCard from "@/components/card/categoryCard/CategoryCard";
import ThemeView from "@/components/themeView/ThemeView";
import { CategoryType } from "@/type/categoryType";
import { isTablet } from "@/utils/isTablet";
import { Href, router } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const Categories = () => {
    let width = Dimensions.get('screen').width - 16;

    const [categories, setCategories] = React.useState<CategoryType[]>([]);
    useEffect(() => {
        (async () => {
            try {
                const rs = await getAllCategoriesApi();
                setCategories(rs.data);
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
            <FlatList
                data={categories}
                columnWrapperStyle={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}
                renderItem={({ item }) => (
                    <CategoryCard
                        key={item.category_id}
                        imageUrl={item.category_thumbnail}
                        title={item.category_name}
                        onPress={() => {
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
                            width: isTablet() ? width / 3 - 24 : width / 2 - 16, 
                            margin: 8, flex: 0
                        }}
                    />
                )}
                keyExtractor={(item) => item.category_id.toString()}
                numColumns={3}
            />
        </ThemeView>
    );
};

export default Categories;
