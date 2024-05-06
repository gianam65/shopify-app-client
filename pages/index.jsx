import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  Box,
  TextField,
  InlineStack,
  Select,
  Thumbnail,
  Scrollable,
  ContextualSaveBar,
  Frame,
} from "@shopify/polaris";
import { HSLAToHex, HEXtoHSLA } from "../utils/";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import "../assets/css/index.scss";
import defaultImage from "../assets/images/default.png";
import AppModal from "../components/common/AppModal";
import AppEditBox from "../components/AppEditBox/AppEditBox";
import { httpGet, httpPost, httpPatch } from "../services";
import AppLoading from "../components/AppLoading/AppLoading";

const ITEMS_PER_PAGE = 5;

export default function HomePage() {
  // Data display
  const [data, setData] = useState([]);
  const [selectedFilterType, setSelectedFilterType] = useState("products");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Config app block
  const [message, setMessage] = useState("Default message");
  const [textSize, setTextSize] = useState(16);
  const [color, setColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
  });

  const [loading, setLoading] = useState(false);
  const [productConfigs, setProductConfigs] = useState({
    message: "",
    textColor: "",
    textSize: 16,
  });
  const [defaultConfig, setDefaultConfig] = useState(null);
  const [isOpenEditBox, setIsOpenEditBox] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [needRenderUnsavedChanges, setNeedRenderUnsavedChanges] =
    useState(false);

  // Data table navigators
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = useMemo(() => {
    return data.length;
  }, [data]);

  const getDefaultConfig = async () => {
    setLoading(true);
    const response = await httpGet("/product-config");
    if (response?.data) {
      const { message, fontSize, color } = response.data;
      setMessage(message);
      setTextSize(+fontSize);
      setColor(color);
    }
    setLoading(false);
    setDefaultConfig(response?.data);
  };
  useEffect(() => {
    getDefaultConfig();
  }, []);

  useEffect(() => {
    if (defaultConfig) {
      const {
        message: DEFAULT_MESSAGE,
        color: DEFAULT_COLOR,
        fontSize: DEFAULT_SIZE,
      } = defaultConfig;
      setNeedRenderUnsavedChanges(
        message !== DEFAULT_MESSAGE ||
          +textSize !== +DEFAULT_SIZE ||
          HSLAToHex(color) !== DEFAULT_COLOR,
      );
    }
  }, [message, textSize, color, defaultConfig]);

  useEffect(() => {
    setProductConfigs({
      message: selectedProduct?.message || "",
      textColor: selectedProduct?.color || "",
      textSize: selectedProduct?.fontSize,
    });
  }, [selectedProduct]);

  const getProducts = async () => {
    setLoading(true);
    let url = "";
    if (searchTerm) {
      url += `/products?name=${searchTerm}`;
    } else {
      url = "/products";
    }
    const response = await httpGet(url);
    setLoading(false);
    setData(response?.data || []);
  };
  useEffect(() => {
    getProducts();
  }, [searchTerm]);

  const handleSyncData = async () => {
    setLoading(true);
    const response = await httpPost("/products/sync");
    setLoading(false);
    setData(response?.data || []);
  };

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  const handleChangeTextSize = useCallback(
    (newValue) => setTextSize(newValue),
    [],
  );

  const handleChangeMessage = useCallback(
    (newValue) => setMessage(newValue),
    [],
  );

  const handlePagination = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (value) => {
    const newItemsPerPage = parseInt(value, 10);
    setItemsPerPage(newItemsPerPage ? newItemsPerPage : ITEMS_PER_PAGE);
    setCurrentPage(1);
  };

  const handleChangeProductConfigs = (fieldName, value) => {
    setProductConfigs((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSaveConfigs = async () => {
    setLoading(true);
    const body = {
      message: productConfigs?.message || selectedProduct?.message || "",
      color:
        HSLAToHex(productConfigs?.textColor) ||
        HSLAToHex(selectedProduct?.color),
      fontSize: productConfigs?.textSize || selectedProduct?.fontSize || "",
    };
    const response = await httpPatch(`/products/${selectedProduct?._id}`, body);
    if (response.success) {
      setSelectedProduct(null);
      setData((prev) =>
        prev.map((p) => {
          if (p._id === response?.data?._id) return response.data;
          return p;
        }),
      );
      setIsOpenEditBox(false);
    }
    setLoading(false);
  };

  const handleSaveChange = async () => {
    setLoading(true);
    const body = {
      message,
      fontSize: +textSize,
      color: HSLAToHex(color),
    };
    const response = await httpPatch("/product-config", body);
    if (response.success) {
      await getDefaultConfig();
      // refreshDataToDefault();
    }
    setLoading(false);
  };

  const refreshDataToDefault = () => {
    if (!defaultConfig) return;
    const { message, fontSize } = defaultConfig;
    setMessage(message);
    setTextSize(fontSize);
    setColor({
      hue: 120,
      brightness: 1,
      saturation: 1,
    });
  };

  return (
    <Frame>
      <Page fullWidth narrowWidth>
        {needRenderUnsavedChanges && (
          <ContextualSaveBar
            alignContentFlush
            message="Unsaved changes"
            saveAction={{
              onAction: handleSaveChange,
            }}
            discardAction={{
              onAction: refreshDataToDefault,
            }}
          />
        )}
        <AppLoading loading={loading} />
        <Layout>
          <Layout.Section>
            <Card roundedAbove="sm" padding="500">
              <Box>
                <Text as="h2" variant="headingSm">
                  Set up text for all products
                </Text>

                <div className="block__stack">
                  <AppEditBox
                    message={message}
                    onChangeMessage={handleChangeMessage}
                    color={color}
                    onChangeColor={setColor}
                    textSize={textSize}
                    onChangeTextSize={handleChangeTextSize}
                  />
                  <div className="block__stack">
                    <Text as="h2" variant="headingSm">
                      Specific products/collections
                    </Text>
                    {data.length === 0 && !searchTerm ? (
                      <InlineStack align="center">
                        <div className="sync__wrap">
                          <Button onClick={handleSyncData}>Sync data</Button>
                        </div>
                      </InlineStack>
                    ) : (
                      <div className="block__stack">
                        <InlineStack align="space-between" blockAlign="center">
                          <TextField
                            label=""
                            autoComplete="off"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={setSearchTerm}
                          />
                          {/* <Select
                            options={[
                              {
                                label: "Filter by Products",
                                value: "products",
                              },
                              {
                                label: "Filter by Collections",
                                value: "collections",
                              },
                            ]}
                            value={selectedFilterType}
                            onChange={(value) => setSelectedFilterType(value)}
                          /> */}
                          <div className="sync__wrap">
                            <Button onClick={handleSyncData}>Sync data</Button>
                          </div>
                        </InlineStack>
                        <Box>
                          <div className="table__container">
                            <Card>
                              <Scrollable style={{ height: "40vh" }}>
                                <div className="table__labels">
                                  <div className="table__label-name">Name</div>
                                  <div className="table__label-name">
                                    Message
                                  </div>
                                  <div className="table__label-name">
                                    Action
                                  </div>
                                </div>
                                <div className="table__list">
                                  {data
                                    .slice(startIndex, endIndex)
                                    .map((dt) => {
                                      return (
                                        <div
                                          key={dt.mappingId}
                                          className="table__item"
                                        >
                                          <div className="table__item-block table__item-name">
                                            <div className="block__img">
                                              <Thumbnail
                                                source={
                                                  dt.image || defaultImage
                                                }
                                                alt="Thumbnail product"
                                              />
                                            </div>
                                            <span className="product__name">
                                              {dt.name}
                                            </span>
                                          </div>
                                          <div className="table__item-block">
                                            {dt.message}
                                          </div>
                                          <div className="table__item-block table__item-action">
                                            <div
                                              className="action-block"
                                              onClick={() => {
                                                setSelectedProduct(dt);
                                                setIsOpenEditBox(true);
                                              }}
                                            >
                                              <FaRegEdit fontSize={16} />
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </Scrollable>
                            </Card>
                            <div className="table__navigations">
                              <div className="table__paginate-offset">
                                <TextField
                                  type="number"
                                  autoComplete="off"
                                  value={itemsPerPage}
                                  onChange={handleItemsPerPageChange}
                                  min={ITEMS_PER_PAGE}
                                  max={data.length}
                                />
                              </div>
                              <div className="table__navigator">
                                <Button
                                  icon={
                                    <GoChevronLeft
                                      className="navigator__icon"
                                      fontSize={16}
                                    />
                                  }
                                  accessibilityLabel="Prev"
                                  variant="primary"
                                  onClick={() => handlePagination("prev")}
                                  disabled={currentPage === 1}
                                />
                                <span>
                                  {currentPage}/{totalPages}
                                </span>
                                <Button
                                  icon={
                                    <GoChevronRight
                                      fontSize={16}
                                      className="navigator__icon"
                                    />
                                  }
                                  accessibilityLabel="Next"
                                  variant="primary"
                                  onClick={() => handlePagination("next")}
                                  disabled={currentPage === totalPages}
                                />
                              </div>
                            </div>
                          </div>
                        </Box>
                      </div>
                    )}
                  </div>
                </div>
              </Box>
            </Card>
          </Layout.Section>
          <AppModal
            open={!!selectedProduct && isOpenEditBox}
            onClose={() => {
              setIsOpenEditBox(false);
              setSelectedProduct(null);
            }}
            onCancel={() => {
              setIsOpenEditBox(false);
              setSelectedProduct(null);
            }}
            onOk={handleSaveConfigs}
          >
            <div gap="400">
              <Box>
                Edit message for specific product/collection:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {selectedProduct?.name}
                </span>
              </Box>
              <AppEditBox
                message={productConfigs.message}
                onChangeMessage={(data) =>
                  handleChangeProductConfigs("message", data)
                }
                color={productConfigs.textColor}
                onChangeColor={(data) =>
                  handleChangeProductConfigs("textColor", data)
                }
                textSize={productConfigs.textSize}
                onChangeTextSize={(data) =>
                  handleChangeProductConfigs("textSize", data)
                }
              />
            </div>
          </AppModal>
        </Layout>
      </Page>
    </Frame>
  );
}
