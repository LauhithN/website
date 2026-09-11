const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const source = fs.readFileSync(
  require("node:path").join(__dirname, "..", "script.js"),
  "utf8",
);
class Element {
  constructor() {
    this.events = {};
    this.attrs = {};
    this.open = false;
    this.classes = new Set();
    this.classList = {
      add: (c) => this.classes.add(c),
      toggle: (c, on) => (on ? this.classes.add(c) : this.classes.delete(c)),
    };
  }
  addEventListener(name, fn) {
    (this.events[name] ||= []).push(fn);
  }
  fire(name) {
    (this.events[name] || []).forEach((fn) => fn());
  }
  setAttribute(k, v) {
    this.attrs[k] = v;
  }
  getAttribute(k) {
    return this.attrs[k];
  }
  removeAttribute(k) {
    delete this.attrs[k];
  }
  getBoundingClientRect() {
    return this.rect || { top: 900, bottom: 1000, height: 88 };
  }
  focus() {
    this.focused = true;
  }
  scrollIntoView(options) {
    this.scrolled = options;
  }
}
for (const reduce of [false, true])
  for (const observerSupported of [false, true]) {
    const header = new Element();
    const year = new Element();
    const details = new Element();
    const marks = [new Element(), new Element()];
    const notes = [new Element(), new Element()];
    const project = new Element();
    project.querySelectorAll = (s) => (s === ".mark" ? marks : notes);
    project.querySelector = () => details;
    const section = new Element();
    section.id = "work";
    const link = new Element();
    link.attrs.href = "#work";
    const hero = new Element();
    const observers = [];
    class IO {
      constructor(cb) {
        this.cb = cb;
        this.targets = [];
        observers.push(this);
      }
      observe(el) {
        this.targets.push(el);
      }
      unobserve() {}
    }
    const window = new Element();
    Object.assign(window, {
      matchMedia: () => ({ matches: reduce }),
      scrollY: 15,
      innerHeight: 800,
    });
    if (observerSupported) window.IntersectionObserver = IO;
    const document = {
      querySelector: (s) =>
        ({ ".site-header": header, "#work": section, ".hero-main": hero })[s],
      querySelectorAll: (s) =>
        ({
          ".reveal": [project],
          '.site-nav a[href^="#"]': [link],
          ".case": [project],
          ".case-details:not([open])": details.open ? [] : [details],
        })[s] || [],
      getElementById: () => year,
    };
    vm.runInNewContext(source, { window, document, IntersectionObserver: IO });
    assert(header.classes.has("is-scrolled"));
    assert(project.classes.has("markers-ready"));
    assert.equal(marks[0].attrs["aria-expanded"], "false");
    marks[1].fire("click");
    assert(details.open);
    assert(notes[1].focused);
    assert(notes[1].classes.has("is-active"));
    assert.equal(notes[1].scrolled.behavior, reduce ? "auto" : "smooth");
    details.fire("toggle");
    assert.equal(marks[0].attrs["aria-expanded"], "true");
    // A visible note must not unnecessarily jump the page.
    notes[0].rect = { top: 150, bottom: 250 };
    marks[0].fire("click");
    assert.equal(notes[0].scrolled, undefined);
    if (observerSupported) {
      const nav = observers.find((o) => o.targets.includes(section));
      nav.cb([{ isIntersecting: true, target: section }]);
      assert.equal(link.attrs["aria-current"], "true");
      const top = observers.find((o) => o.targets.includes(hero));
      top.cb([{ isIntersecting: true, target: hero }]);
      assert.equal(link.attrs["aria-current"], undefined);
    }
    details.open = false;
    window.fire("beforeprint");
    assert(details.open);
    window.fire("afterprint");
    assert(!details.open);
    details.open = true;
    window.fire("beforeprint");
    window.fire("afterprint");
    assert(details.open);
    assert.equal(year.textContent, String(new Date().getFullYear()));
  }
console.log(
  "PASS: project annotations expand/focus/scroll; visibility guards; navigation reset; print state restoration; reduced motion and missing observer fallbacks (4 configurations).",
);
