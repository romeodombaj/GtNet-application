$(() => {
  const URL = "http://localhost:3000/users";

  const usersStore = new DevExpress.data.CustomStore({
    key: "id",
    load() {
      return sendRequest(`${URL}/`);
    },
    insert(values) {
      return sendRequest(`${URL}/new`, "POST", { values });
    },
    update(key, values) {
      return sendRequest(`${URL}/${key}`, "PUT", { values, key });
    },
    remove(key) {
      return sendRequest(`${URL}/${key}`, "DELETE", {
        key,
      });
    },
  });

  const dataGrid = $("#grid")
    .dxDataGrid({
      dataSource: usersStore,
      repaintChangesOnly: true,
      showBorders: true,
      editing: {
        refreshMode: "reshape",
        mode: "cell",
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: true,
        useIcons: true,
      },
      paging: {
        pageSize: 30,
        pageIndex: 0,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [20, 30, 50],
        showNavigationButtons: true,
      },
      buttons: [
        "delete",
        {
          name: "edit",
          visible: false,
        },
      ],
      columns: [
        { dataField: "id", caption: "ID", allowEditing: false },
        {
          dataField: "name",
          caption: "Name",
          validationRules: [
            { type: "required" },
            {
              type: "stringLength",
              max: 25,
              message: "Max length of name is 25 letters.",
            },
          ],
        },
        {
          dataField: "surname",
          caption: "Surname",
          validationRules: [
            { type: "required" },
            {
              type: "stringLength",
              max: 25,
              message: "Max length of surname is 25 letters.",
            },
          ],
        },
        {
          dataField: "phone",
          caption: "Phone",
          validationRules: [
            { type: "required" },
            {
              type: "pattern",
              message: 'Your phone must have "(555) 555-5555" format!',
              pattern: /^(\+?\d{1,3})?\d{7,14}$|^(0\d{9,10})$/i,
            },
          ],
        },
        {
          dataField: "email",
          caption: "Email",
          validationRules: [{ type: "required" }, { type: "email" }],
        },
        {
          type: "buttons",
          width: 110,
          buttons: [{ name: "edit", visible: false }, "delete"],
        },
      ],
      onInitNewRow: function (e) {
        e.component.option("editing.mode", "form");
      },
      onEditCanceled: function (e) {
        e.component.option("editing.mode", "cell");
      },

      /*onCellClick: function (e) {
        e.component.option("editing.mode", "cell");
      },*/
      /*summary: {
        totalItems: [
          {
            column: "id",
            summaryType: "count",
          },
        ],
      },*/
    })
    .dxDataGrid("instance");

  $("#refresh-mode").dxSelectBox({
    items: ["full", "reshape", "repaint"],
    value: "reshape",
    inputAttr: { "aria-label": "Refresh Mode" },
    onValueChanged(e) {
      dataGrid.option("editing.refreshMode", e.value);
    },
  });

  $("#clear").dxButton({
    text: "Clear",
    onClick() {
      $("#requests ul").empty();
    },
  });

  function sendRequest(url, method = "GET", data) {
    const d = $.Deferred();

    logRequest(method, url, data);

    $.ajax(url, {
      method,
      data: JSON.stringify(data),
      contentType: "application/json",
      cache: false,
      xhrFields: { withCredentials: false },
    })
      /// RESULT : RESULT??
      .done((result) => {
        d.resolve(method === "GET" ? result : result);
      })
      .fail((xhr) => {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
      });

    return d.promise();
  }

  function logRequest(method, url, data) {
    const args = Object.keys(data || {})
      .map((key) => `${key}=${data[key]}`)
      .join(" ");

    const logList = $("#requests ul");
    const time = DevExpress.localization.formatDate(new Date(), "HH:mm:ss");
    const newItem = $("<li>").text(
      [time, method, url.slice(URL.length), args].join(" ")
    );

    logList.prepend(newItem);
  }
});
