import { addProductToCartApi } from '@/apis/cart'
import { addReviewProductApi, cancelOrder, getOrder } from '@/apis/order'
import Button from '@/components/button/Button'
import OrderItemCard from '@/components/card/orderCard/OrderItemCard'
import OrderItemReviewCard from '@/components/card/orderCard/OrderItemReviewCard'
import Input from '@/components/input/Input'
import Row from '@/components/row/Row'
import Space from '@/components/space/Space'
import Tag from '@/components/tag/Tag'
import ThemeText from '@/components/themeText/ThemeText'
import ThemeView from '@/components/themeView/ThemeView'
import UploadImage from '@/components/uploadImage/UploadImage'
import { ORDER_STATUS } from '@/constants/order_status'
import { CartContext } from '@/context/cart'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Order } from '@/type/orderType'
import { convertPrice } from '@/utils/convertPrice'
import { isTablet } from '@/utils/isTablet'
import { GetImageFromLibrary } from '@/utils/uploadImage'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { router, useLocalSearchParams } from 'expo-router'
import { ArrowRotateLeft, Back, Minus, Trash } from 'iconsax-react-native'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Image, View } from 'react-native'
import ConfirmationModal from 'react-native-confirmation'
import { ScrollView } from 'react-native-gesture-handler'
import { ImageViewer, ImageWrapper } from 'react-native-reanimated-viewer'
import StarRating from 'react-native-star-rating-widget'
import Toast from 'react-native-toast-message'

const OrderDetail = () => {
  const { orderId } = useLocalSearchParams<{
    orderId: string;
  }>();
  const width = Dimensions.get('screen').width
  const red = useThemeColor({}, 'red')
  const icon = useThemeColor({}, 'icon')

  const { reloadData } = useContext(CartContext)
  const [isVisible, setIsVisible] = useState(false)
  const [orderDetail, setOrderDetail] = useState<Order>()
  const productPrice = orderDetail?.order_detail.reduce((acc, cur) => acc + Number(cur.order_price ?? 0) * (cur.order_quantity ?? 0), 0) ?? 0
  const [reload, setReload] = useState(false)

  useEffect(() => {
    (async () => {
      const rs = await getOrder(orderId)
      setOrderDetail(rs.data)
    })()
  }, [reload])

  const snapPoints = useMemo(() => ["50%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleOpenBottomSheet = async () => {
    bottomSheetRef.current?.snapToIndex(1);
    setStartRating(5)
    setComment('')
    setImages([])
  };

  const [loading, setLoading] = useState(false);
  const [reviewIndex, setReviewIndex] = useState<number>(0);
  const [startRating, setStartRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [images, setImages] = React.useState<string[]>([]);
  const imageRef = useRef(null);

  const handleSubmitReview = async () => {
    try {
      if (!orderDetail) return
      setLoading(true)
      const rs = await addReviewProductApi(orderDetail.order_id, orderDetail.order_detail[reviewIndex].product_id, startRating, comment, images)
      console.log(rs)
      Toast.show({
        text1: 'Success',
        text2: 'Review success',
        type: 'success',
      })
      bottomSheetRef.current?.close()
      setLoading(false)
    } catch (error: any) {
      console.log(error)
      Toast.show({
        text1: 'Error',
        text2: error.message,
        type: 'error',
      })
      setLoading(false)
    }
  }

  return (
    <ThemeView>
      <Row
        style={{
          justifyContent: "space-between",
          backgroundColor: useThemeColor({}, 'background'),
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Button
          variant="circle"
          icon={<Back size={20} color={useThemeColor({}, 'text')} />}
          onPress={() => {
            router.back();
          }}
        />
        <ThemeText text={orderDetail?.order_status.toLocaleUpperCase()} type="title" />
        {!(orderDetail?.order_status === ORDER_STATUS.CANCELLED || orderDetail?.order_status === 'delivered' ||
          orderDetail?.order_status === 'shipped') ?
          (
            <Row>
              <Button
                variant="circle"
                icon={
                  <Trash
                    size={20}
                    color={red}
                  />
                }
                onPress={async () => {
                  setIsVisible(true)
                }}
                disabled={orderDetail?.order_status === ORDER_STATUS.CANCELLED || orderDetail?.order_status === 'delivered' ||
                  orderDetail?.order_status === 'shipped'
                }
              />
            </Row>
          ) : (
            <Row style={{
              opacity: 0
            }}>
              <Button
                variant="circle"
                icon={
                  <Trash
                    size={20}
                    color={red}
                  />
                }
                onPress={async () => {
                  setIsVisible(true)
                }}
                disabled={orderDetail?.order_status === ORDER_STATUS.CANCELLED || orderDetail?.order_status === 'delivered' ||
                  orderDetail?.order_status === 'shipped'
                }
              />
            </Row>
          )
        }
      </Row>
      <ThemeView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: useThemeColor({}, 'primaryLight'),
            borderRadius: 8,
          }}>
            <Row justifyContent='space-between'>
              <ThemeText type='medium' text='Order Id: ' />
              <ThemeText type='medium' text={orderDetail?.order_id.toString()}
                style={{
                  fontWeight: 'bold'
                }}
              />
            </Row>
            <Space size={{ height: 8, width: 0 }} />
            <Row justifyContent='space-between'>
              <ThemeText type='medium' text='Order time: ' />
              <ThemeText type='medium' text={(new Date(orderDetail?.order_created_at ?? '')).toDateString()}
                style={{
                  fontWeight: 'bold'
                }}
              />
            </Row>
          </View>
          <Space size={{ height: 8, width: 0 }} />
          <ThemeText type='medium' text='Purchase Products'
            style={{
              fontWeight: 'bold'
            }}
          />
          <Space size={{ height: 8, width: 0 }} />
          {
            orderDetail?.order_detail.map((item, index) => (
              <OrderItemCard
                key={index}
                productPrice={Number(item.order_price)}
                productQuantity={item.order_quantity}
                productName={item.product_name}
                productImage={JSON.parse(item.product_images)?.[0] ?? ""}
                style={{
                  marginBottom: 8,
                  marginHorizontal: 4
                }}
                reviewPress={() => {
                  handleOpenBottomSheet()
                  setReviewIndex(index)
                  setReload(!reload)
                }}
                order_id={orderDetail?.order_id}
                product_id={item.product_id}
              />
            ))
          }
          <Space size={{ height: 16, width: 0 }} />
          <ThemeText type='medium' text='Receiver Infomation'
            style={{
              fontWeight: 'bold'
            }}
          />
          <Space size={{ height: 8, width: 0 }} />
          <Row justifyContent='flex-start'>
            <ThemeText type='medium' text={orderDetail?.receiver_name} style={{
              fontWeight: 'bold'
            }} />
            <Space size={{ width: 8, height: 0 }} />
            <ThemeText type='medium' text={orderDetail?.receiver_phone} />
          </Row>
          <Space size={{ height: 8, width: 0 }} />
          <ThemeText type='medium' text={`${orderDetail?.receiver_address}, ${orderDetail?.ward_name}, ${orderDetail?.district_name}, ${orderDetail?.province_name}`} />
          <Space size={{ height: 16, width: 0 }} />
          <Row justifyContent='space-between'>
            <ThemeText type='medium' text='Shipping unit'
              style={{
                fontWeight: 'bold'
              }}
            />
            <Tag type='primary' text={orderDetail?.delivery_method_name ?? ''} />
          </Row>
          <Space size={{ height: 8, width: 0 }} />
          <Row justifyContent='space-between'>
            <ThemeText type='medium' text='Payment Method'
              style={{
                fontWeight: 'bold'
              }}
            />
            <Tag type='primary' text={orderDetail?.payment_method_name ?? ''} />
          </Row>
          <Space size={{ height: 16, width: 0 }} />
          <ThemeText
            type='medium' text='Payment Details'
            style={{
              fontWeight: 'bold'
            }}
          />
          <Space size={{ height: 8, width: 0 }} />
          <Row justifyContent='space-between'>
            <ThemeText type='medium' text={`Product Price (${orderDetail?.order_detail.length} products): `} />
            <Row>
              <ThemeText type='medium' text={convertPrice(
                productPrice
              )}
                style={{
                  fontWeight: 'bold'
                }}
              />
              <ThemeText type='small' text=' VND' />
            </Row>
          </Row>
          <Space size={{ height: 8, width: 0 }} />
          <Row justifyContent='space-between'>
            <ThemeText type='medium' text={`Delivery Fee: `} />
            <Row>
              <ThemeText type='medium' text={convertPrice(
                (Number(orderDetail?.order_total_amount ?? 0) - productPrice)
              )}
                style={{
                  fontWeight: 'bold'
                }}
              />
              <ThemeText type='small' text=' VND' />
            </Row>
          </Row>
          <Space size={{ height: 8, width: 0 }} />
          <Row justifyContent='space-between'>
            <ThemeText type='medium' text={`Total Paid: `} style={{
              fontWeight: 'bold'
            }} />
            <Row>
              <ThemeText type='medium' text={convertPrice(
                (Number(orderDetail?.order_total_amount ?? 0))
              )}
                style={{
                  fontWeight: 'bold',
                }}
              />
              <ThemeText type='small' text=' VND' />
            </Row>
          </Row>
          <Space size={{ height: 32, width: 0 }} />
          <Row justifyContent='flex-end'>
            <Button
              text='Reorder'
              icon={<ArrowRotateLeft size={16} color={useThemeColor({}, 'white')} />}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
              onPress={async () => {
                const rs = orderDetail?.order_detail.map(async (item) => {
                  await addProductToCartApi(item.product_id, item.order_quantity)
                })
                if (rs) {
                  await Promise.all(rs)
                }
                reloadData()
                router.push('/cart')
              }}
            />
          </Row>
          <Space size={{ height: 16, width: 0 }} />
        </ScrollView>
      </ThemeView>
      {/* // model  */}
      <ConfirmationModal
        colorScheme={"system"}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        message="Are you sure you want to delete?"
        onConfirm={async () => {
          try {
            await cancelOrder(orderId)
            reloadData()
            router.push('/(tabs)/orders')
          } catch (error: any) {
            Toast.show({
              text1: 'Error',
              text2: error.message,
              type: 'error',
            })
          }
        }}
      />
      {/* // model  */}
      {/* // bottom sheet */}
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
          }}
        >
          <ThemeView>
            <OrderItemReviewCard
              image={JSON.parse(orderDetail?.order_detail[reviewIndex].product_images ?? "[]")[0]}
              title={orderDetail?.order_detail[reviewIndex].product_name ?? ""}
            />
            <Space size={{ height: 16, width: 0 }} />
            <ThemeView>
              <Row justifyContent='space-between'>
                <ThemeText type='medium' text='Star Rating' style={{
                  fontWeight: 'bold'
                }} />
                <StarRating
                  rating={startRating}
                  starStyle={{
                    marginRight: 0,
                    marginLeft: 0
                  }}
                  onChange={setStartRating}
                />
              </Row>
              <Space size={{ height: 16, width: 0 }} />
              <ThemeText type='medium' text='Comment' style={{
                fontWeight: 'bold'
              }} />
              <Space size={{ height: 8, width: 0 }} />
              <Row style={{ flex: 1 }}>
                <Input
                  type='text-area'
                  value={comment}
                  onChangeText={setComment}
                  placeholder='Comment here...'
                  style={{ flex: 1 }}
                />
                <Space size={{ height: 0, width: 8 }} />
                <UploadImage style={{
                  height: '100%',
                  paddingHorizontal: 16
                }}
                  onPress={async () => {
                    const rs = await GetImageFromLibrary()
                    if (rs) {
                      setImages([...images, rs])
                    }
                  }}
                />
              </Row>
              <Space size={{ height: 12, width: 0 }} />
              <ImageViewer
                ref={imageRef}
                data={
                  images.map((el) => ({
                    key: el,
                    source: { uri: el },
                  }))
                }
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <Row justifyContent='flex-start'>
                  {images.map((el, index) => (
                    <View key={el} style={{
                      position: 'relative'
                    }}>
                      <ImageWrapper
                        viewerRef={imageRef}
                        index={index}
                        source={{
                          uri: el,
                        }}
                        style={{
                          width: isTablet() ? width / 6 : width / 4,
                          height: isTablet() ? width / 6 : width / 4,
                          maxWidth: 120,
                          maxHeight: 120,
                          borderRadius: 8,
                          marginRight: 8
                        }}
                      >
                        <Image
                          source={{
                            uri: el
                          }}
                          style={{
                            width: isTablet() ? width / 6 : width / 4,
                            height: isTablet() ? width / 6 : width / 4,
                            maxWidth: 120,
                            maxHeight: 120,
                            borderRadius: 8,
                            marginRight: 8
                          }}
                        />
                      </ImageWrapper>
                      <View style={{
                        position: 'absolute',
                        top: 0,
                        right: 8,
                      }}>
                        <Button
                          variant='link'
                          icon={<Minus size={20} color={red} />}
                          style={{
                            paddingHorizontal: 4,
                          }}
                          onPress={() => {
                            setImages(images.filter((_, i) => i !== index))
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </Row>
              </ScrollView>
              <Space size={{ height: 16, width: 0 }} />
              <Button text='Send'
                onPress={handleSubmitReview}
                loading={loading}
              />
              <Space size={{ height: 16, width: 0 }} />
            </ThemeView>
          </ThemeView>
        </BottomSheetScrollView>
      </BottomSheet>
      {/* // bottom sheet */}
    </ThemeView>
  )
}

export default OrderDetail