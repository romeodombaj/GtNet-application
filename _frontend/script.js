$(() => {
  const URL = "http://localhost:3000/users";

  const usersStore = new DevExpress.data.CustomStore({
    key: "id",
    load() {
      return sendRequest(`${URL}/`);
    },
    insert(values) {
      return sendRequest(`${URL}/new`, "POST", {
        values: JSON.stringify(values),
      });
    },
    update(key, values) {
      return sendRequest(`${URL}/${key}`, "PUT", {
        key,
        values: JSON.stringify(values),
      });
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
      },
      scrolling: {
        mode: "virtual",
      },
      columns: ["id", "name", "surname", "phone", "email"],
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
      data,
      cache: false,
      xhrFields: { withCredentials: false },
    })
      .done((result) => {
        console.log(result.data);
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
