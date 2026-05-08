import { getDistricts, getProvinces, getWards } from "@/apis/location";
import {
    addAddress,
    deleteAddress,
    getAllAddress,
    updateAddress,
} from "@/apis/user";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Row from "@/components/row/Row";
import Select from "@/components/select/Select";
import Space from "@/components/space/Space";
import ThemeText from "@/components/themeText/ThemeText";
import ThemeView from "@/components/themeView/ThemeView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Address } from "@/type/addressType";
import { District, Province, Ward } from "@/type/locationType";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { AddSquare, Back, Edit, Trash } from "iconsax-react-native";
import React, { useEffect, useMemo, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const AddressBook = () => {
    const [addressList, setAddressList] = React.useState<Address[]>([]);
    const itemBackground = useThemeColor({}, "itemBackground");
    const white = useThemeColor({}, "white");
    const border = useThemeColor({}, "border");
    const icon = useThemeColor({}, "icon");
    const primary = useThemeColor({}, "primary");

    // state
    const [isButtonAddLoading, setIsButtonAddLoading] = React.useState(false);
    const [isButtonUpdateLoading, setIsButtonUpdateLoading] =
        React.useState(false);

    const [provinces, setProvinces] = React.useState<Province[]>([]);
    const [districts, setDistricts] = React.useState<District[]>([]);
    const [wards, setWards] = React.useState<Ward[]>([]);

    // ---------------- add State ----------------
    const [receiverName, setReceiverName] = React.useState("");
    const [receiverPhone, setReceiverPhone] = React.useState("");
    const [receiverProvince, setReceiverProvince] = React.useState<string>();
    const [receiverDistrict, setReceiverDistrict] = React.useState<string>();
    const [receiverWard, setReceiverWard] = React.useState<string>();
    const [receiverStreetName, setReceiverStreetName] =
        React.useState<string>();

    // ------------ update State ------------
    const [receiverAddressIdSelected, setReceiverAddressIdSelected] =
        React.useState<number>(0);
    const [receiverNameSelected, setReceiverNameSelected] =
        React.useState<string>("");
    const [receiverPhoneSelected, setReceiverPhoneSelected] =
        React.useState<string>("");
    const [receiverAddressSelected, setReceiverAddressSelected] =
        React.useState<string>("");

    const [receiverProvinceSelected, setReceiverProvinceSelected] =
        React.useState<string>("");
    const [receiverDistrictSelected, setReceiverDistrictSelected] =
        React.useState<string>("");
    const [receiverWardSelected, setReceiverWardSelected] =
        React.useState<string>("");
    const [receiverStreetNameSelected, setReceiverStreetNameSelected] =
        React.useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                fetchAddressList();
                const provincesData = await getProvinces();
                setProvinces(provincesData.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    // ref
    const snapPoints = useMemo(() => ["92%"], []);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenBottomSheet = () => {
        bottomSheetRef.current?.snapToIndex(1);

        setReceiverName("");
        setReceiverPhone("");
        setReceiverDistrict(undefined);
        setReceiverProvince(undefined);
        setReceiverStreetName(undefined);
        setReceiverWard("");
    };

    const bottomSheetUpdateRef = useRef<BottomSheet>(null);
    const handleOpenBottomSheetUpdate = async (
        receiverName: string,
        receiverPhone: string,
        receiverAddress: string,
        receiverProvince: string,
        receiverDistrict: string,
        receiverWard: string,
        receiverAddressId: number
    ) => {
        handleSelectProvince(receiverProvince);
        handleSelectDistrict(receiverDistrict);

        setReceiverAddressIdSelected(receiverAddressId);
        setReceiverNameSelected(receiverName);
        setReceiverPhoneSelected(receiverPhone);
        setReceiverProvinceSelected(receiverProvince);
        setReceiverDistrictSelected(receiverDistrict);
        setReceiverWardSelected(receiverWard);
        setReceiverStreetNameSelected(receiverAddress);

        bottomSheetUpdateRef.current?.snapToIndex(1);
    };

    // function
    const fetchAddressList = async () => {
        const response = await getAllAddress();
        setAddressList(response.data);
    };

    const handleSelectProvince = async (value: string) => {
        const response = await getDistricts(Number(value));
        setDistricts(response.data);
    };

    const handleSelectDistrict = async (value: string) => {
        const response = await getWards(Number(value));
        setWards(response.data);
    };

    const handleAddAddress = async () => {
        if (
            !receiverName ||
            !receiverPhone ||
            !receiverProvince ||
            !receiverDistrict ||
            !receiverWard ||
            !receiverStreetName
        ) {
            Toast.show({
                text1: "Please fill all fields",
                type: 'error',
            });

            return;
        }

        setIsButtonAddLoading(true);

        try {
            await addAddress(
                receiverName,
                receiverPhone,
                receiverProvince,
                receiverDistrict,
                receiverWard,
                receiverStreetName
            );
            bottomSheetRef.current?.close();
            fetchAddressList();
            setIsButtonAddLoading(false);

            Toast.show({
                text1: "Add address successfully",
                type: 'success',
            });
        } catch (error) {
            console.log(error);
            setIsButtonAddLoading(false);
        }
    };

    const handleUpdateAddress = async () => {
        if (!receiverNameSelected || !receiverPhoneSelected) {
            Toast.show({
                text1: "Please fill all fields",
                type: 'error',
            });

            return;
        }
        setIsButtonUpdateLoading(true);
        try {

            console.log(
                receiverAddressIdSelected,
                receiverNameSelected,
                receiverPhoneSelected,
                receiverProvinceSelected,
                receiverDistrictSelected,
                receiverWardSelected,
                receiverStreetNameSelected
            )

            const rs = await updateAddress(
                receiverAddressIdSelected,
                receiverNameSelected,
                receiverPhoneSelected,
                receiverProvinceSelected,
                receiverDistrictSelected,
                receiverWardSelected,
                receiverStreetNameSelected
            );
            bottomSheetUpdateRef.current?.close();
            fetchAddressList();
            setIsButtonUpdateLoading(false);

            Toast.show({
                text1: "Update address successfully",
                type: 'success',
            });
        } catch (error) {
            console.log(error);
            setIsButtonUpdateLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, position: "relative" }}>
            <Row
                style={{
                    justifyContent: "space-between",
                    backgroundColor: useThemeColor({}, "background"),
                    paddingVertical: 8,
                    paddingHorizontal: 8,
                }}
            >
                <Button
                    variant="circle"
                    icon={<Back size={20} color={useThemeColor({}, "text")} />}
                    onPress={() => {
                        router.back();
                    }}
                />

                <ThemeText text="Address Book" type="title" />

                <Button
                    variant="circle"
                    onPress={() => { }}
                    style={{ opacity: 0, pointerEvents: "none" }}
                />
            </Row>

            <ThemeView
            >
                <ScrollView style={{
                    paddingHorizontal: 8
                }}>
                    {addressList.map((address, index) => {
                        return (
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
                                    <TouchableOpacity
                                        onPress={() => {
                                            handleOpenBottomSheetUpdate(
                                                address.receiver_name,
                                                address.receiver_phone,
                                                address.receiver_address,
                                                address.province_id.toString(),
                                                address.district_id.toString(),
                                                address.ward_id.toString(),
                                                address.receiver_address_id,
                                            );
                                        }}
                                    >
                                        <Edit size={20} color={primary} />
                                    </TouchableOpacity>
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
                        );
                    })}
                    <Space size={{ height: 64, width: 0 }} />
                </ScrollView>

                <Space size={{ height: 32, width: 0 }} />
                <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 16,
                        backgroundColor: itemBackground,
                    }}
                >
                    <Button
                        text="Add address"
                        color="primary"
                        onPress={() => {
                            handleOpenBottomSheet();
                        }}
                        icon={<AddSquare size={20} color={white} />}
                    />
                </View>
            </ThemeView>

            {/* // Bottom Sheet */}
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                index={-1}
                backgroundStyle={{
                    borderColor: useThemeColor({}, "border"),
                    borderWidth: 1
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
                    >
                        <ThemeText text="Add Address" type="title" />
                    </Row>
                    <Space size={{ height: 16, width: 0 }} />
                    <View
                        style={{
                            padding: 16,
                            backgroundColor: useThemeColor(
                                {},
                                "background"
                            ),
                        }}
                    >
                        <Input
                            label="Receiver Name"
                            value={receiverName}
                            onChangeText={(value) => {
                                setReceiverName(value);
                            }}
                            placeholder="Enter receiver name"
                        />
                        <Space size={{ height: 16, width: 0 }} />
                        <Input
                            label="Receiver Phone"
                            value={receiverPhone}
                            onChangeText={(value) => {
                                setReceiverPhone(value);
                            }}
                            placeholder="Enter receiver phone"
                        />
                        <Space size={{ height: 16, width: 0 }} />
                        <ThemeText
                            text="Address"
                            type="title"
                            style={{
                                fontSize: 16,
                                fontWeight: "500",
                                marginBottom: 4,
                            }}
                        />
                        <Select
                            numsOfVisibleItems={3}
                            placeHolder="City/Province"
                            options={provinces.map((opt) => {
                                return {
                                    label: opt.name,
                                    value: opt.id.toString(),
                                };
                            })}
                            value={receiverProvince}
                            onChange={(value) => {
                                handleSelectProvince(value);
                                setReceiverProvince(value);
                            }}
                        />
                        <Space size={{ height: 8, width: 0 }} />
                        <Select
                            numsOfVisibleItems={3}
                            placeHolder="District"
                            options={districts.map((opt) => {
                                return {
                                    label: opt.name,
                                    value: opt.id.toString(),
                                };
                            })}
                            value={receiverDistrict}
                            onChange={(value) => {
                                handleSelectDistrict(value);
                                setReceiverDistrict(value);
                            }}
                        />
                        <Space size={{ height: 8, width: 0 }} />
                        <Select
                            numsOfVisibleItems={3}
                            placeHolder="Ward"
                            options={wards.map((opt) => {
                                return {
                                    label: opt.name,
                                    value: opt.id.toString(),
                                };
                            })}
                            value={receiverWard}
                            onChange={(value) => {
                                setReceiverWard(value);
                            }}
                        />
                        <Space size={{ height: 8, width: 0 }} />
                        <Input
                            placeholder="House Number, Street Name"
                            value={receiverStreetName ?? ""}
                            onChangeText={(value) => {
                                setReceiverStreetName(value);
                            }}
                        />
                    </View>
                    <Space size={{ height: 16, width: 0 }} />
                    <View
                        style={{
                            padding: 16,
                            backgroundColor: useThemeColor(
                                {},
                                "background"
                            ),
                        }}
                    >
                        <Button
                            text="Add address"
                            color="primary"
                            onPress={() => {
                                handleAddAddress();
                            }}
                            loading={isButtonAddLoading}
                        />
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>

            <BottomSheet
                ref={bottomSheetUpdateRef}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                index={-1}
                backgroundStyle={{
                    borderColor: useThemeColor({}, "border"),
                    borderWidth: 1
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
                    >
                        <ThemeText text="Update Address" type="title" />
                    </Row>
                    <Space size={{ height: 16, width: 0 }} />
                    <View
                        style={{
                            padding: 16,
                            backgroundColor: useThemeColor(
                                {},
                                "background"
                            ),
                        }}
                    >
                        <Input
                            label="Receiver Name"
                            value={receiverNameSelected}
                            onChangeText={(value) => {
                                setReceiverNameSelected(value);
                            }}
                            placeholder="Enter receiver name"
                        />
                        <Space size={{ height: 16, width: 0 }} />
                        <Input
                            label="Receiver Phone"
                            value={receiverPhoneSelected}
                            onChangeText={(value) => {
                                setReceiverPhoneSelected(value);
                            }}
                            placeholder="Enter receiver phone"
                        />
                        <Space size={{ height: 16, width: 0 }} />

                        <ThemeText
                            text="Address"
                            type="title"
                            style={{
                                fontSize: 16,
                                fontWeight: "500",
                                marginBottom: 4,
                                marginLeft: 4,
                            }}
                        />
                        <Space size={{ height: 16, width: 0 }} />
                        <Select
                            numsOfVisibleItems={3}
                            placeHolder="City/Province"
                            options={provinces.map((opt) => {
                                return {
                                    label: opt.name,
                                    value: opt.id.toString(),
                                };
                            })}
                            value={receiverProvinceSelected}
                            onChange={(value) => {
                                handleSelectProvince(value);
                                setReceiverProvinceSelected(value);
                            }}
                        />
                        <Space size={{ height: 8, width: 0 }} />
                        <Select
                            numsOfVisibleItems={3}
                            placeHolder="District"
                            options={districts.map((opt) => {
                                return {
                                    label: opt.name,
                                    value: opt.id.toString(),
                                };
                            })}
                            value={receiverDistrictSelected}
                            onChange={(value) => {
                                handleSelectDistrict(value);
                                setReceiverDistrictSelected(value);
                            }}
                        />
                        <Space size={{ height: 8, width: 0 }} />
                        <Select
                            numsOfVisibleItems={3}
                            placeHolder="Ward"
                            options={wards.map((opt) => {
                                return {
                                    label: opt.name,
                                    value: opt.id.toString(),
                                };
                            })}
                            value={receiverWardSelected}
                            onChange={(value) => {
                                setReceiverWardSelected(value);
                            }}
                        />
                        <Space size={{ height: 8, width: 0 }} />
                        <Input
                            placeholder="House Number, Street Name"
                            value={receiverStreetNameSelected ?? ""}
                            onChangeText={(value) => {
                                setReceiverStreetNameSelected(value);
                            }}
                        />
                    </View>
                    <Space size={{ height: 16, width: 0 }} />
                    <TouchableOpacity
                        style={{
                            marginHorizontal: 16,
                            borderRadius: 8,
                            backgroundColor: useThemeColor({}, 'itemBackground')
                        }}
                        onPress={async () => {
                            // call api to delete address
                            try {
                                const rs = await deleteAddress(
                                    receiverAddressIdSelected
                                );
                                fetchAddressList();
                                bottomSheetUpdateRef.current?.close();
                                Toast.show({
                                    text1: "Delete address successfully",
                                    type: 'success',
                                });
                            } catch (error: any) {
                                Toast.show({
                                    text1: `${error.messages}`,
                                    type: 'error',
                                });
                            }
                        }}
                    >
                        <Row
                            justifyContent="space-between"
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 16,
                            }}
                        >
                            <ThemeText
                                type="medium"
                                text="Delete address"
                                style={{
                                    marginLeft: 8,
                                    fontWeight: "500",
                                    color: useThemeColor({}, "red"),
                                }}
                            />
                            <Trash size={20} color={useThemeColor({}, "red")} />
                        </Row>
                    </TouchableOpacity>
                    <Space size={{ height: 16, width: 0 }} />
                    <View
                        style={{
                            padding: 16,
                            backgroundColor: useThemeColor(
                                {},
                                "background"
                            ),
                        }}
                    >
                        <Button
                            text="Update address"
                            color="primary"
                            onPress={() => {
                                handleUpdateAddress();
                            }}
                            loading={isButtonUpdateLoading}
                        />
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
            {/* // Bottom Sheet */}
        </View>
    );
};

export default AddressBook;
