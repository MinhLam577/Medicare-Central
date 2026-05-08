import { checkoutSingleApi, getDeliveryMethodsApi, getPaymentMethodsApi } from '@/apis/checkout';
import { getProductByIdApi } from '@/apis/product';
import { getAllAddress } from '@/apis/user';
import Button from '@/components/button/Button';
import CartCard from '@/components/card/cartCard/CartCard';
import CheckBox from '@/components/checkBox/CheckBox';
import Header from '@/components/header/Header';
import HorizontalRule from '@/components/horizontalRule/HorizontalRule';
import ItemCheckbox from '@/components/itemCheckbox/ItemCheckbox';
import Row from '@/components/row/Row';
import Space from '@/components/space/Space';
import ThemeText from '@/components/themeText/ThemeText';
import ThemeView from '@/components/themeView/ThemeView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Address } from '@/type/addressType';
import { DeliveryMethod } from '@/type/deliveryType';
import { PaymentMethod } from '@/type/paymentType';
import { ProductType } from '@/type/productType';
import { convertPrice } from '@/utils/convertPrice';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Href, router, useLocalSearchParams } from 'expo-router';
import { Add } from 'iconsax-react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

const checkout = async (
    selectedAddress: Address,
    selectedDeliveryMethod: DeliveryMethod,
    selectedPaymentMethod: PaymentMethod,
    product_id: number,
    quantity: number
) => {
    try {
        return checkoutSingleApi(
            selectedAddress.receiver_address_id,
            selectedPaymentMethod.payment_method_id,
            selectedDeliveryMethod.delivery_method_id,
            product_id,
            quantity
        )
    } catch (error: any) {
        Toast.show({
            text1: "Error",
            text2: error.message,
            type: 'error'
        })
    }
}
const Checkout = () => {
    const width = useWindowDimensions().width;
    const { productCheckoutData } = useLocalSearchParams<{
        productCheckoutData: string;
    }>();
    const { product_id, quantity } = JSON.parse(productCheckoutData);

    const [loading, setLoading] = React.useState(false);

    const [addressList, setAddressList] = React.useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = React.useState<Address>();
    const [deliveryMethod, setDeliveryMethod] = React.useState<DeliveryMethod[]>([]);
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = React.useState<DeliveryMethod>();
    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<PaymentMethod>();

    const [product, setProduct] = React.useState<ProductType>();

    const snapPoints = useMemo(() => ["50%"], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenBottomSheet = async () => {
        bottomSheetRef.current?.snapToIndex(1);
    };

    useEffect(() => {
        (async () => {
            try {
                const response = await getAllAddress();
                setAddressList(response.data);
                setSelectedAddress(response.data[0]);

                const deliveryMethod = await getDeliveryMethodsApi();
                setDeliveryMethod(deliveryMethod.data);
                setSelectedDeliveryMethod(deliveryMethod.data[0]);
                const paymentMethod = await getPaymentMethodsApi();
                setPaymentMethod(paymentMethod.data);
                setSelectedPaymentMethod(paymentMethod.data[0]);

                const product = await getProductByIdApi(Number(product_id));
                setProduct(product.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);


    const background = useThemeColor({}, "background");
    const text = useThemeColor({}, "text");
    const border = useThemeColor({}, "border");
    const itemBackground = useThemeColor({}, "itemBackground");
    const primary = useThemeColor({}, "primary");

    return (
        <ThemeView>
            {/* // Header ------------------- */}
            <Header title='Checkout' type='secondary' />
            <ScrollView scrollEnabled showsVerticalScrollIndicator={false}>
                {
                    product && (
                        <CartCard
                            type='small'
                            key={product.product_id}
                            productImage={product.product_images?.[0] ?? ""}
                            productName={product.product_name}
                            cartPrice={Number.parseFloat(product.product_price)}
                            cartQuantity={quantity}
                            style={{
                                marginBottom: 8,
                                pointerEvents: "none",
                                marginHorizontal: 8
                            }}
                        />
                    )
                }
                <Space size={{ height: 16, width: 0 }} />
                <HorizontalRule text='' type='normal' />
                <Space size={{ height: 16, width: 0 }} />
                <ThemeView>
                    <ThemeText type='medium' text='Delivery Address'
                        style={{
                            fontWeight: 'bold',
                        }}
                    />
                    <Space size={{ height: 16, width: 0 }} />
                    {
                        selectedAddress ? (
                            <TouchableOpacity
                                style={{
                                    padding: 16,
                                    borderRadius: 8,
                                    marginBottom: 8,
                                    backgroundColor: itemBackground,
                                }}
                                onPress={handleOpenBottomSheet}
                            >
                                <Row justifyContent="space-between">
                                    <ThemeText
                                        type="medium"
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                        text={selectedAddress.receiver_name}
                                    />
                                </Row>
                                <Space size={{ height: 8, width: 0 }} />
                                <ThemeText
                                    text={selectedAddress.receiver_phone}
                                    type="medium"
                                    style={{}}
                                />
                                <Space size={{ height: 8, width: 0 }} />
                                <ThemeText
                                    text={`${selectedAddress.receiver_address}, ${selectedAddress.ward_name}, ${selectedAddress.district_name}, ${selectedAddress.province_name}`}
                                    type="medium"
                                    style={{}}
                                />
                            </TouchableOpacity>
                        ) : (
                            <Row justifyContent='space-between' style={{
                                padding: 16,
                                borderRadius: 8,
                                marginBottom: 8,
                                backgroundColor: itemBackground,
                            }}>
                                <ThemeText text='No address found' type='medium' />
                                <Space size={{ height: 16, width: 0 }} />
                                <Button
                                    variant='link'
                                    text='Add Address'
                                    onPress={() => {
                                        router.navigate(`/(app)/addressBook/AddressBook` as Href);
                                    }}
                                    icon={<Add size={20} color={primary} />}
                                    iconPosition='right'
                                />
                            </Row>
                        )
                    }
                </ThemeView>
                <ThemeView>
                    <ThemeText type='medium' text='Delivery method'
                        style={{
                            fontWeight: 'bold',
                        }}
                    />
                    <Space size={{ height: 16, width: 0 }} />
                    {
                        deliveryMethod.map((item, index) => (
                            <ItemCheckbox
                                isChecked={selectedDeliveryMethod?.delivery_method_id === item?.delivery_method_id}
                                checkedChange={() => {
                                    setSelectedDeliveryMethod(item);
                                }}
                                label={item?.delivery_method_name}
                                delivery_method_description={item?.delivery_method_description}
                                delivery_fee={convertPrice(Number(item?.delivery_fee))}
                                style={{
                                    marginBottom: index === deliveryMethod.length - 1 ? 0 : 8,
                                }}
                            />
                        ))
                    }
                </ThemeView>
                <Space size={{ height: 16, width: 0 }} />
                <ThemeView>
                    <ThemeText type='medium' text='Payment method'
                        style={{
                            fontWeight: 'bold',
                        }}
                    />
                    <Space size={{ height: 16, width: 0 }} />
                    {
                        paymentMethod.map((item, index) => {
                            if (item.payment_method_id === 1) 
                            return (
                                <ItemCheckbox
                                    isChecked={selectedPaymentMethod?.payment_method_id === item?.payment_method_id}
                                    checkedChange={() => {
                                        setSelectedPaymentMethod(item);
                                    }}
                                    label={item?.payment_method_description.toLocaleUpperCase()}
                                    style={{
                                        marginBottom: index === deliveryMethod.length - 1 ? 0 : 8,
                                    }}
                                />
                            )
                        })
                    }
                </ThemeView>
                <Space size={{ height: 16, width: 0 }} />
                <ThemeView>
                    <ThemeText type='medium' text='Payment Detail'
                        style={{
                            fontWeight: 'bold',
                        }}
                    />
                    <Space size={{ height: 8, width: 0 }} />
                    <Row justifyContent='space-between'>
                        <ThemeText text={`Estimated Price (${quantity} products)`} type='medium' />
                        <Row>
                            <ThemeText text={convertPrice(
                                product ? Number.parseFloat(product.product_price) * quantity : 0
                            )} type='medium'
                                style={{
                                    fontWeight: 'bold',
                                }}
                            />
                            <Space size={{ height: 0, width: 8 }} />
                            <ThemeText text='VND' type='small' />
                        </Row>
                    </Row>
                    <Space size={{ height: 8, width: 0 }} />
                    <Row justifyContent='space-between'>
                        <ThemeText text='Delivery Fee' type='medium' />
                        <Row>
                            <ThemeText text={convertPrice(Number(selectedDeliveryMethod?.delivery_fee))} type='medium'
                                style={{
                                    fontWeight: 'bold',
                                }}
                            />
                            <Space size={{ height: 0, width: 8 }} />
                            <ThemeText text='VND' type='small' />
                        </Row>
                    </Row>
                    <Space size={{ height: 16, width: 0 }} />
                    <Row justifyContent='flex-end'>
                        <View>
                            <ThemeText text='Total' type='medium' style={{
                                textAlign: 'right',
                                fontWeight: 'bold',
                            }} />
                            <Row>
                                <ThemeText text={convertPrice(
                                    product ? Number.parseFloat(product.product_price) * quantity + Number(selectedDeliveryMethod?.delivery_fee) : 0
                                )} type='medium'
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
                    </Row>
                </ThemeView>
                <Space size={{ height: 16, width: 0 }} />
                <HorizontalRule />
                <Space size={{ height: 16, width: 0 }} />
                <ThemeView>
                    <Button
                        loading={loading}
                        text='Pay Now'
                        onPress={async () => {
                            setLoading(true);
                            if (selectedAddress && selectedDeliveryMethod && selectedPaymentMethod) {
                                const rs = await checkout(
                                    selectedAddress,
                                    selectedDeliveryMethod,
                                    selectedPaymentMethod,
                                    Number(product_id),
                                    quantity
                                );
                                Toast.show({
                                    text1: "Success",
                                    text2: "Checkout successfully",
                                    type: 'success'
                                })
                                if (selectedPaymentMethod.payment_method_name === 'COD') {
                                    console.log('COD')
                                    router.navigate("/(app)/(tabs)/orders")
                                    return
                                }
                                const checkoutUrl = rs?.data;
                                router.replace(
                                    `/(app)/checkout/payment/${encodeURIComponent(checkoutUrl)}` as Href,
                                )
                            } else {
                                if (!selectedAddress) {
                                    Toast.show({
                                        text1: "Error",
                                        text2: "Please select address",
                                        type: 'error'
                                    })
                                }
                                if (!selectedDeliveryMethod) {
                                    Toast.show({
                                        text1: "Error",
                                        text2: "Please select delivery method",
                                        type: 'error'
                                    })
                                }
                                if (!selectedPaymentMethod) {
                                    Toast.show({
                                        text1: "Error",
                                        text2: "Please select payment method",
                                        type: 'error'
                                    })
                                }
                            }
                            setLoading(false);
                        }}
                    />
                </ThemeView>
                <Space size={{ height: 16, width: 0 }} />
            </ScrollView>

            {/* // BottomSheet  */}
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                index={-1}
                backgroundStyle={{
                    borderColor: border,
                    borderWidth: 1,
                }}
            >
                <BottomSheetScrollView
                    style={{
                        backgroundColor: background,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingHorizontal: 8,
                    }}
                >
                    <ThemeText
                        type="medium"
                        text="Select Address"
                        style={{
                            fontWeight: "bold",
                            padding: 16,
                            textAlign: "center",
                        }}
                    />
                    <Space size={{ height: 8, width: 0 }} />
                    <ThemeView>
                        {
                            addressList.map((address, index) => (
                                <View
                                    key={index}
                                    style={{
                                        padding: 16,
                                        borderColor: border,
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <Row justifyContent="space-between">
                                        <ThemeText
                                            type="medium"
                                            style={{
                                                fontWeight: "bold",
                                            }}
                                            text={address.receiver_name}
                                        />
                                        <CheckBox
                                            isChecked={selectedAddress?.receiver_address_id === address?.receiver_address_id}
                                            checkedChange={() => {
                                                setSelectedAddress(address);
                                                bottomSheetRef.current?.snapToIndex(0);
                                            }}
                                        />
                                    </Row>
                                    <Space size={{ height: 8, width: 0 }} />
                                    <ThemeText
                                        text={address.receiver_phone}
                                        type="medium"
                                        style={{}}
                                    />
                                    <Space size={{ height: 8, width: 0 }} />
                                    <ThemeText
                                        text={`${address.receiver_address}, ${address.ward_name}, ${address.district_name}, ${address.province_name}`}
                                        type="medium"
                                        style={{}}
                                    />
                                </View>
                            ))
                        }
                    </ThemeView>
                </BottomSheetScrollView>
            </BottomSheet>
            {/* // BottomSheet  */}
        </ThemeView>
    )
}

export default Checkout