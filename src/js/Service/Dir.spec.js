const { DirService } = require("./Dir"),
  CWD = process.cwd(),
  mock = require("mock-fs"),
  { join } = require("path");

describe("Service/Dir", () => {

  beforeEach(() => {
    mock({
      foo: {
        bar: {
          baz: "baz", // file contains text baz 
          qux: "qux"
        }
      }
    });
  });
  afterEach(mock.restore);

  describe("#getFileList", () => {
    it("receives intended file list", () => {
      const service = new DirService(join("foo", "bar"));
      service.setDir("bar");
      let files = service.getFileList();
      expect(files.length).toBe(2);
    });
    it("every file has expected properties", () => {
      const service = new DirService(join("foo", "bar"));
      const files = service.getFileList();
      console.log(files);
      const [file] = files;
      expect(file.fileName).toBe("baz");
      expect(file.stats.size).toBe(3);
      expect(file.stats.isFile()).toBe(true);
      expect(file.stats.isDirectory()).toBe(false);
      expect(file.stats.mtime).toBeTruthy();
    });
  });

  describe("#setDir", () => {
    it("fire update event", (done) => {
      const service = new DirService("foo");
      service.on("update", () => {
        expect(true).toBe(true);
        done();
      });
      service.notify();
    });
  });

}); 