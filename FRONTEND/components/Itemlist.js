import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Sparepart1 from "../assests/spare_part_img1.jpg";
import Sparepart2 from "../assests/spare_part_img2.jpg";

import "../styles/itemlist.css";

export default function Itemlist() {
  const [isLoading, setIsLoading] = useState(true);
  const [slides, setSlides] = useState([]);
  const [spareParts, setSpareParts] = useState([]);

  useEffect(() => {
    api
      .get("/spareParts/get")
      .then((response) => {
        console.log("Response:", response.data);
        setSpareParts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const handleArrowClick = () => {
      const arrows = document.querySelectorAll(".arrow");
      const itemLists = document.querySelectorAll(".item-list");

      arrows.forEach((arrow, i) => {
        const itemList = itemLists[i]; // Ensure itemList is defined
        if (!itemList) return;

        const itemNumber = itemList.querySelectorAll("img").length;
        let clickCounter = 0;
        arrow.addEventListener("click", () => {
          const ratio = Math.floor(window.innerWidth / 270);
          clickCounter++;
          if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
            itemList.style.transform = `translateX(${
              itemList.computedStyleMap().get("transform")[0].x.value - 300
            }px)`;
          } else {
            itemList.style.transform = "translateX(0)";
            clickCounter = 0;
          }
        });
      });

      return () => {
        // Clean up event listeners when the component is unmounted
        arrows.forEach((arrow) => {
          arrow.removeEventListener("click", handleArrowClick);
        });
      };
    };

    handleArrowClick();
  }, [spareParts]); // Add spareParts as dependency to rerun the effect when spareParts changes
  return (
    <div>
      <div class="item-list-container">
        <h1 class="item-list-title">NEW ARRIVALS</h1>

        <div class="item-list-wrapper">
          <div class="item-list">
            <div class="item-list-item">
              <img class="item-list-item-img" src={Sparepart1} alt="" />
              <span class="item-list-item-title">Front Bumper</span>
              <p class="item-list-item-desc">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At hic
                fugit similique accusantium.
              </p>
              <button class="item-list-item-button">Read More</button>
            </div>
            <div class="item-list-item">
              <img class="item-list-item-img" src={Sparepart2} alt="" />
              <span class="item-list-item-title">Front Bumpers</span>
              <p class="item-list-item-desc">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At hic
                fugit similique accusantium.
              </p>
              <button class="item-list-item-button">Read More</button>
            </div>

            <div class="item-list-item">
              <img class="item-list-item-img" src={Sparepart2} alt="" />
              <span class="item-list-item-title">Front Bumpers</span>
              <p class="item-list-item-desc">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At hic
                fugit similique accusantium.
              </p>
              <button class="item-list-item-button">Read More</button>
            </div>

            {spareParts.map((sparePart, index) => (
              <div className="item-list-item  ">
                <img
                  className="item-list-item-img"
                  src={`data:image/png;base64,${sparePart.image}`}
                  alt="Base64 Image"
                />
                <span className="item-list-item-title">{sparePart.name}</span>
                <p className="item-list-item-desc">{sparePart.description}</p>

                <a
                  className="nav-link"
                  href={`/View_Cart_item/${sparePart._id}`}
                >
                  <button className="item-list-item-button">Read More</button>
                </a>
              </div>
            ))}
          </div>
          <i class="fas fa-chevron-right arrow"></i>
        </div>
      </div>
    </div>
  );
}
