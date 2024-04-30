import { mount } from "@vue/test-utils";
import EditProjectFile from "./EditProjectFile.vue";
import * as editProjectFileService from "./editProjectFileService";

jest.mock("@/app/components/readme-motd/editProjectFileService", () => ({
  getFileText: jest.fn(() =>
    Promise.resolve({
      success: true,
      contents: "sample file content",
    }),
  ),
  saveProjectFile: jest.fn(() =>
    Promise.resolve({
      success: true,
      message: "File saved successfully.",
    }),
  ),
}));

jest.mock("@/library/rundeckService", () => ({
  getRundeckContext: jest.fn().mockReturnValue({
    rundeckClient: {
      getFileText: jest.fn().mockResolvedValue({
        filename: "readme.md",
        success: true,
        contents: "Some content",
        rdBase: "http://localhost:4440",
      }),
      saveProjectFile: jest.fn().mockResolvedValue({
        success: true,
        message: "File saved successfully.",
      }),
    },
    rdBase: "http://localhost:4440",
  }),
  url: jest.fn().mockReturnValue("http://localhost:4440"),
}));
let wrapper;
const mountEditProjectFile = async (props = {}) => {
  wrapper = mount(EditProjectFile, {
    props: {
      filename: "readme.md",
      project: "default",
      authAdmin: true,
      displayConfig: ["none"],
      ...props,
    },
    global: {
      mocks: {
        $t: (msg) => msg,
      },
    },
  });
  await wrapper.vm.$nextTick();
};

describe("EditProjectFile", () => {
  beforeEach(async () => {
    await mountEditProjectFile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it.each([
    ["readme.md", "edit.readme.label"],
    ["motd.md", "edit.motd.label"],
  ])("renders the correct title for %s", async (filename, expectedTitle) => {
    await mountEditProjectFile({ filename });
    expect(wrapper.find('[data-test-id="title"]').text()).toContain(
      expectedTitle,
    );
  });

  it("renders file content when getFileText method returns successfully", async () => {
    expect(wrapper.vm.fileText).toBe("sample file content");
  });

  it("handles failure when getFileText method fails", async () => {
    (editProjectFileService.getFileText as jest.Mock).mockImplementationOnce(
      () => Promise.reject(new Error("Failed to fetch file")),
    );
    wrapper.vm.notifyError = jest.fn();
    await wrapper.vm.getFileText();
    expect(wrapper.vm.notifyError).toHaveBeenCalledWith("Failed to fetch file");
  });

  it("handles failure when user edits the file and fails to save it", async () => {
    (editProjectFileService.saveProjectFile as jest.Mock).mockRejectedValue(
      new Error("Failed to save file"),
    );
    wrapper.vm.notifyError = jest.fn();
    wrapper.vm.fileText = "new content";
    await wrapper.find('[data-test-id="save"]').trigger("click");
    expect(wrapper.vm.notifyError).toHaveBeenCalledWith("Failed to save file");
  });

  it("handles success when user edits the file and saves it", async () => {
    wrapper.vm.fileText = "new content";
    await wrapper.find('[data-test-id="save"]').trigger("click");
    expect(
      editProjectFileService.saveProjectFile as jest.Mock,
    ).toHaveBeenCalledWith("default", "readme.md", "new content");
  });

  it("displays admin specific message and configuration link when user is an admin", async () => {
    const footerText = wrapper.find(".card-footer").text();
    expect(footerText).toContain("file.warning.not.displayed.admin.message");
    expect(wrapper.find(".card-footer a").text()).toBe(
      "project.configuration.label",
    );
  });

  it("displays non-admin specific message when user is not an admin", async () => {
    await mountEditProjectFile({
      authAdmin: false,
    });
    expect(wrapper.text()).toContain(
      "file.warning.not.displayed.nonadmin.message",
    );
  });
  it("does not allow non-admin user to save the file", async () => {
    await mountEditProjectFile({ authAdmin: false });
    wrapper.vm.save = jest.fn();
    wrapper.vm.getFileText = jest.fn();

    wrapper.find('[data-test-id="save"]').trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.save).not.toHaveBeenCalled();
  });
  it("does not allow non-admin user to edit the file", async () => {
    await mountEditProjectFile({ authAdmin: false });
    expect(wrapper.find('[data-test-id="my-ace-editor"]').exists()).toBe(false);
  });
  it("renders the correct strings when user doesn't have permissions", async () => {
    await mountEditProjectFile({ authAdmin: false });
    expect(wrapper.text()).toContain(
      "file.warning.not.displayed.nonadmin.message",
    );
  });
  it("renders the correct strings when user has permissions", async () => {
    expect(wrapper.text()).toContain(
      "file.warning.not.displayed.admin.message",
    );
  });
  it("cancels edits when the user clicks the cancel button", async () => {
    wrapper.vm.originalFileText = "sample file content";
    wrapper.vm.fileText = "edited content";
    wrapper.vm.createProjectHomeLink = jest.fn(() => {
      wrapper.vm.fileText = wrapper.vm.originalFileText;
    });
    await wrapper.find('[data-test-id="cancel"]').trigger("click");
    expect(wrapper.vm.createProjectHomeLink).toHaveBeenCalled();
    expect(wrapper.vm.fileText).toBe("sample file content");
  });
});
