import {
  Text,
  Box,
  TextField,
  // InlineStack,
  ColorPicker,
} from "@shopify/polaris";
import { useState, useEffect } from "react";
import "./AppEditBox.scss";
import { HSLAToHex } from "../../utils";

const AppEditBox = ({
  message,
  onChangeMessage,
  color,
  onChangeColor,
  textSize,
  onChangeTextSize,
}) => {
  const [needShowColorPicker, setNeedShowColorPicker] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        needShowColorPicker &&
        event.target.closest(".color__picker") === null &&
        event.target.closest(".color__box") === null
      ) {
        setNeedShowColorPicker(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [needShowColorPicker]);
  return (
    <>
      <Box>
        <TextField
          label={
            <Text as="p" variant="headingSm">
              Message
            </Text>
          }
          value={message}
          onChange={onChangeMessage}
          multiline={4}
          autoComplete="off"
        />
      </Box>
      <div className="inline__stack edit__container">
        {/* <InlineStack gap="400" align="space-between" blockAlign="center"> */}
        <Box>
          <Box>
            <Text as="p" variant="headingSm">
              Text color
            </Text>
          </Box>
          <div className="inline_stack" style={{ gap: 12 }}>
            {/* <InlineStack blockAlign="center" gap="400"> */}
            <TextField autoComplete="off" value={HSLAToHex(color)} />
            <div className="color__box-container">
              <div
                onClick={() => setNeedShowColorPicker((prev) => !prev)}
                className="color__box"
                style={{
                  backgroundColor: HSLAToHex(color),
                }}
              ></div>
              {needShowColorPicker && (
                <div className="color__picker">
                  <ColorPicker
                    onChange={onChangeColor}
                    color={color}
                    allowAlpha={false}
                  />
                </div>
              )}
            </div>
            {/* </InlineStack> */}
          </div>
        </Box>
        <Box>
          <TextField
            type="number"
            label={
              <Text as="p" variant="headingSm">
                Text size
              </Text>
            }
            onChange={onChangeTextSize}
            min={5}
            value={textSize}
            autoComplete="off"
          />
        </Box>
        {/* </InlineStack> */}
      </div>
    </>
  );
};

export default AppEditBox;
