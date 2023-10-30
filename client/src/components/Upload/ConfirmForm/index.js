import Wrapper from "~/components/Upload/Wrapper";
import classNames from "classnames/bind";
import styles from "./ConfirmForm.module.scss";
import InputItem from "~/components/Layout/Author/InputItem";
import DropDownMenu from "~/components/DropDown";

const cx = classNames.bind(styles);

function ConfirmForm({
  id,
  qty,
  setQty,
  SIZE,
  size,
  setSize,
  purpose,
  handlePrevClick,
  handleUploadClick,
  SPECIES,
  species,
  setSpecies,
  breed,
  setBreed,
  age,
  setAge,
  price,
  setPrice,
  TYPEPRODUCT,
  typeProduct,
  setTypeProduct,
  error,
}) {
  return (
    <Wrapper className={cx("confirm-wrapper")}>
      <div className={cx("form-wrapper")}>
        <h1 className={cx("heading")}>Confirm information</h1>
        <div className={cx("form")}>
          <h2 className={cx("title")}>Pet Details</h2>
          {/* Input Item */}
          {id !== "Stuff" && (
            <InputItem
              title="Species *"
              placeholder=""
              className={cx("input-item")}
              value={species}
              setValue={setSpecies}
              readonly="readonly"
            />
          )}

          {/* Input Item */}
          {id === "Stuff" && (
            <DropDownMenu
              title="Species *"
              ListValue={SPECIES}
              value={species}
              setValue={setSpecies}
              className={cx("input-item", "input-desc")}
            />
          )}

          {id === "Stuff" && (
            <DropDownMenu
              title="Type of Product *"
              ListValue={TYPEPRODUCT}
              value={typeProduct}
              setValue={setTypeProduct}
              className={cx("input-item", "input-desc")}
            />
          )}

          {/* Input Item */}
          {id !== "Stuff" && (
            <>
              <InputItem
                title="Breed *"
                placeholder="Breed"
                className={cx("input-item")}
                value={breed}
                setValue={setBreed}
              />
              {error.breed && (
                <p style={{ color: "red", marginTop: 10, paddingLeft: 5 }}>
                  {error.breed}
                </p>
              )}
            </>
          )}
          {/* Input Item */}
          <div className={cx("row")}>
            {id !== "Stuff" && (
              <>
                <InputItem
                  title="Age *"
                  type="number"
                  placeholder="Age"
                  className={cx("input-item")}
                  value={age}
                  setValue={setAge}
                />
                {error.age && (
                  <p style={{ color: "red", marginTop: 10, paddingLeft: 5 }}>
                    {error.age}
                  </p>
                )}
              </>
            )}

            {id === "Stuff" && (
              <DropDownMenu
                title="Size *"
                ListValue={SIZE}
                value={size}
                setValue={setSize}
                className={cx("input-item", "input-desc")}
              />
            )}

            {id === "Stuff" && (
              <>
                <InputItem
                  title="Qty *"
                  type="number"
                  placeholder="Quantity"
                  className={cx("input-item")}
                  value={qty}
                  setValue={setQty}
                />
                {error.qty && (
                  <p style={{ color: "red", marginTop: 10, paddingLeft: 5 }}>
                    {error.qty}
                  </p>
                )}
              </>
            )}

            {purpose !== "Gift" && (
              <>
                <InputItem
                  title="Price *"
                  type="number"
                  placeholder="Price"
                  className={cx("input-item")}
                  value={price}
                  setValue={setPrice}
                />
                {error.price && (
                  <p style={{ color: "red", marginTop: 10, paddingLeft: 5 }}>
                    {error.price}
                  </p>
                )}
              </>
            )}
          </div>
          {purpose === "Gift" && (
            <p className={cx("desc-price")}>
              Price has been set to $0 because as your post's intention is to
              offer it as a gift.
            </p>
          )}
        </div>
      </div>
      {/* Action */}
      <div className={cx("list-action")}>
        <div className={cx("action")} onClick={handlePrevClick}>
          BACK
        </div>
        <div className={cx("action", "active")} onClick={handleUploadClick}>
          UPLOAD
        </div>
      </div>
    </Wrapper>
  );
}

export default ConfirmForm;
