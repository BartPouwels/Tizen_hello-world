/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
    /**
     * Handles the hardware key event.
     * @private
     * @param {Object} event - The hardware key event object
     */
    function keyEventHandler(event) {
        if (event.keyName === "back") {
            try {
                // If the back key is pressed, exit the application.
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    }

    /**
     * Initializes the application.
     * @private
     */
    function init() {
        var textbox = document.querySelector("#contents");

        // Add hardware event listener
        document.addEventListener("tizenhwkey", keyEventHandler);

        // Add click event listener
        textbox.addEventListener("click", function() {
            var box = document.querySelector("#content-text");

            if (box.innerHTML === "Inner textbox content, Druk op mij!!") {
                box.innerHTML = "Press action called, niet zo hard drukken!";
            } else {
                box.innerHTML = "Inner textbox content, Druk op mij!!";
            }
        });
    }

    // The function "init" will be executed after the application successfully loaded.
    window.onload = init;
}());