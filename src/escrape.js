class Escrape {
    /** Iterator value for the next new declared instance. */
    static #iterator = 0
    /** Default configuration object for Escrape instances. */
    static defaultConfig = {
        /**
         * Dictionary of keywords and their respective scores, used for scoring whether an
         * element contribute to the article body. In the `findArticleContainer` method, each
         * keyword is sought in lowecase within the element's id, tag name, and/or classes.
         * 
         * Each keyword impacts the score at most once. For example, for a `span` with a class
         * of `timespan`, the keyword entry `{span:5}` would increase its score by by 5, not 10. However, multiple keywords can match the
         * However, entries `{span:10, time:5}` would increase its score by 15 because multiple
         * keywords can match the same element.
         * 
         * Use `.class`, `#id`, or `+tag` syntaxes to target specific attributes. To
         * match exact text, use a targeted prefix and a space suffix (e.g., `+i ` to target
         * the `i` tag without also matching `img`.)
         */
        selectorKeywordScores: {
            '+div ': 5,
            '+pre ': 5,
            '+section ': 5,
            '+p ': 10,
            'article': 25,
            'body': 25,
            'content': 25,
            'entry': 25,
            'hentry': 25,
            'main': 25,
            'page': 25,
            'post': 25,
            'text': 25,
            'blog': 25,
            'story': 25,
            'column': 25,
            '+dl ': -5,
            '+dt ': -5,
            '+dd ': -5,
            '+li ': -5,
            '+ol ': -5,
            '+td ': -5,
            '+ul ': -5,
            '.grid': -25,
            'attribution': -25,
            'blocks': -25,
            'combx': -25,
            'comment': -25,
            'contact': -25,
            'reference': -25,
            'foot': -25,
            'footer': -25,
            'footnote': -25,
            'infobox': -25,
            'masonry': -25,
            'masthead': -25,
            'media': -25,
            'meta': -25,
            'outbrain': -25,
            'promo': -25,
            'related': -25,
            'scroll': -25,
            'shoutbox': -25,
            'sidebar': -25,
            'sponsor': -25,
            'shopping': -25,
            'tags': -25,
            'tool': -25,
            'widget': -25,
            'community': -25,
            'disqus': -25,
            'extra': -25,
            'header': -25,
            'menu': -25,
            'remark': -25,
            'rss': -25,
            'shoutbox': -25,
            'sidebar': -25,
            'sponsor': -25,
            'ad-break': -25,
            'pagination': -25,
            'pager': -25,
            'popup': -25,
            'tweet': -25,
            'twitter': -25,
            'viewcode': -25,
        },
        /** List of 'display' style values that indicate the element should be treated as a block element (e.g.: block, inline-block). */
        blockDisplayStyles: ['block', 'flex', 'grid', 'inline-block', 'inline-flex'],
        /** List of 'position' style values that indicate the element should be treated as a block element (e.g.: absolute). */
        blockPositionStyles: ['absolute', 'fixed', 'sticky'],
        /** List of html tags that display as a block element by default (e.g.: div, h1). */
        blockTags: ['address', 'article', 'aside', 'blockquote', 'br', 'canvas', 'dd', 'div', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'noscript', 'ol', 'p', 'pre', 'section', 'table', 'td', 'th', 'tr', 'thead', 'tfoot', 'ul', 'video'],
        /** List of html tags that are often direct containers of prose (e.g.: p, span). */
        proseTags: ['p', 'pre', 'span', 'td'],
        /** List of html tags constituting section headers (e.g.: h1, h2) */
        headingTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        /** List of html tags that serve as non-display page infrastructure (e.g.: `script`, `style`, `meta`). */
        abstractTags: ['head', 'link', 'meta', 'noscript', 'script', 'style'],
        /** List of html tags that do contain text but are often purely for annotations (e.g.: label, address). */
        descriptiveTags: ['address', 'blockquote', 'cite', 'figcaption', 'footer', 'header', 'output', 'pre', 'sup', 'tfoot'],
        /** List of html tags for interactive, non-prose elements (e.g.: button, img, menu). */
        interactiveTags: ['button', 'canvas', 'dialog', 'embed', 'figure', 'form', 'frame', 'iframe', 'img', 'input', 'label', 'menu', 'menuitem', 'nav', 'object', 'select', 'svg', 'textarea', 'video'],
        /** List of html element roles for non-article, interactive elements (e.g.: alert, banner, tooltip). */
        asideRoles: ['alert', 'alertdialog', 'banner', 'button', 'columnheader', 'combobox', 'complementary', 'dialog', 'directory', 'figure', 'heading', 'img', 'listbox', 'marquee', 'math', 'menu', 'menubar', 'menuitem', 'navigation', 'option', 'search', 'searchbox', 'status', 'toolbar', 'tooltip'],
        /** List of css classes of typical elements like div or span that xxx. */
        asideClasses: ['blogroll', 'caption', 'citation', 'comment', 'community', 'contact', 'copyright', 'extra', 'foot', 'footer', 'footnote', 'hide-print', 'infobox', 'masthead', 'media', 'meta', 'metadata', 'mw-jump-link', 'mw-revision', 'navigation', 'navigation-not-searchable', 'noprint', 'outbrain', 'pager', 'popup', 'promo', 'reference', 'reference-text', 'references', 'related', 'related-articles', 'remark', 'rss', 's-popover', 'scroll', 'shopping', 'shoutbox', 'sidebar', 'sponsor', 'tag-cloud', 'tags', 'thumb', 'tool', 'user-info', 'widget', 'wikitable'],
        /** Minimum percentage (0-1) of text under an element that must be owned by a selector for the whole element to be considered a container of that selector. */
        containerRatioThreshold: 0.4,
        /** Minimum text length within an element to be considered textual. */
        textLengthThreshold: 75,
        /** Maximum level to traverse upward when propagating text-length scores to parents. */
        textContainerTraversalDepth: 4,
    }

    /**
     * Constructs a new Escrape instance. No processing occurs during construction, so
     * you may create new instances cheaply.
     * @param {object} config Configuration object. See documentation on `defaultConfig` and `setConfig`.
     * @param {HTMLElement} element Root element that will be scraped. Typically document.body.
     */
    constructor(config = Escrape.defaultConfig, element = document.body) {
        this.setConfig(config)
        this.reset()
        this.rootNode = element
    }

    /**
     * Updates the configuration object with the config provided. If only a partial object
     * is supplied, then only those settings will be updated and any missing settings will
     * either stay their current value or, if unset, use the default Escrape configuration
     * for that setting.
     * @param {object} config Full or partial configuration object
     */
    setConfig(config) {
        this.config = {...Escrape.defaultConfig, ...config}
    }
    
    /**
     * Unignores all elements and resets text length, score, and container estimations
     * that had been cached for performance. Most useful when the configuration or page
     * content change significantly.
     * @returns {Escrape} Same instance of Escrape, for method chaining.
     */
    reset() {
        this.iterator = ++Escrape.#iterator
        return this
    }

    /**
     * Retrieves the host-provided description of the page based on `meta` tags or, if
     * `meta` tags are absent, common description elements.
     * @param {HTMLElement} The root DOM node to search for the page description. 
     * @returns {string} A string containing the page description if available.
     */
    getPageDescription(node = this.rootNode) {
        const metas = node.querySelectorAll('meta[description],meta[name=description],meta[property=og\\:description]')
        for (const meta of metas) {
            if (meta.description)
                return meta.description
            if (meta.content)
                return meta.content
        }
        const shortDescription = node.querySelectorAll('.shortdescription')
        if (shortDescription.length == 1)
            return shortDescription[0].innerText

        return ''
    }

    /**
     * Retrieves the host-provided title of the page based on the H1 tag or, if there is
     * not precisely one h1, the title tag.
     * @param {HTMLElement} The root DOM node to search for the page title.
     * @returns {string} A string containing the page title if available.
     */
    getPageTitle(node = this.rootNode) {
        const h1s = node.querySelectorAll('h1')
        if (h1s.length == 1)
            return h1s[0].textContent
        if (node.ownerDocument.title)
            return node.ownerDocument.title.split(/( - | \| )/)[0].trim()
    }

    *select(selector, node = this.rootNode, iteration = this.iterator) {
        for (const n of node.querySelectorAll(selector))
            if (!this.isIgnored(n, iteration) && !this.isHidden(n))
                yield n
    }

    *selectContainersOf(selector, title = '', node = this.rootNode, iteration = this.iterator, ratioThreshold = this.config.containerRatioThreshold) {
        const nodes = [...this.select(selector, node, iteration)]
        const property = `${title}Container`

        let currentNode
        while (currentNode = nodes.shift()) {
            this.#set(property, true, currentNode, iteration)
            yield currentNode

            const parent = currentNode.parentNode
            if (parent && this.#get(property, parent, iteration) == null) {
                const isContainer = this.calculateTextFill(selector, node, iteration) > ratioThreshold
                this.#set(property, isContainer, parent, iteration)
                if (isContainer)
                    nodes.push(parent)
            }
        }
    }

    *selectHyperlinkContainers(node = this.rootNode, iteration = this.iterator, minimumHyperlinks = 3) {
        for (const n of this.selectContainersOf('a', 'link', node, iteration))
            if (n.tagName.toLowerCase() != 'a') {
                if (this.isBlock(n))
                    yield n
                if (this.select('a', n, iteration).length >= minimumHyperlinks)
                    yield n
            }
    }

    *selectProseElements(selector, node = this.rootNode, iteration = this.iterator) {
        for (const n of this.select(selector, node, iteration))
            if (this.isSignificantTextLength(n, iteration))
                yield n
    }

    /**
     * Retrieves a list of elements that provide basic page infrastructure, often located
     * in the page's `head` (e.g.: `script`, `style`, `meta`).
     * @param {HTMLElement} node Parent element under which to find abstract elements.
     * @returns NodeListOf<any> List of elements matching the `config.abstractTags` selector.
     */
    selectAbstractElements(node = this.rootNode) {
        const selector = this.config.abstractTags.join(',')
        return node.querySelectorAll(selector)
    }

    /**
     * Retrieves a list of elements that are typically noise, such as citations.
     * @param {HTMLElement} node Parent element under which to find aside elements.
     * @param {int} iteration Iteration number. See `nextIteration` method for explanation.
     * @returns {NodeListOf<any>} List of elements matching the `config.asideClasses` and `config.absideRoles` selectors.
     */
    selectAsideElements(node = this.rootNode, iteration = this.iterator) {
        const selector = '.' + this.config.asideClasses.join(',.')
            + ',[role=' + this.config.asideRoles.join('],[role=') + ']'
        return this.select(selector, node, iteration)
    }

    /**
     * Retrieves a list of containers of display-oriented elements that are descriptive
     * (`h2`, `address`, etc.) or interactive (`button`, `menu`, etc.).
     * See `selectContainersOf` for a better understanding of containers and thresholds. 
     * @param {HTMLElement} node Parent element under which to find aside elements.
     * @param {int} iteration Iteration number. See `nextIteration` method for explanation.
     * @returns {Generator<HTMLElement>} List of elements matching the `config.descriptiveTags`, `config.headingTags`, and `config.interactiveTags` selectors.
     */
    selectVisualContainers(node = this.rootNode, iteration = this.iterator) {
        const selector = this.config.descriptiveTags.join(',')
            + ',' + this.config.interactiveTags.join(',')
            + ',' + this.config.headingTags.join(',')

        return this.selectContainersOf(selector, 'visual', node, iteration)
    }
    
    /**
     * Scores all containers of prose, and returns the highest ranking container (element).
     * If all containers have negative scores, nothing is returned.
     * 
     * Specifically, the parent of each (visible, unignored) element matching the
     * `config.proseSelector` are evaluated and scored, traversed to a limit defined by
     * `config.textContainerTraversalDepth`.
     * 
     * @param {HTMLElement} node Parent element under which to search.
     * @param {int} iteration Iteration number. See `nextIteration` method for explanation.
     * @returns {HTMLElement} Highest-scoring 
     */
    findArticleContainer(node = this.rootNode, iteration = this.iterator) {
        let nodes = []
        const proseSelector = this.config.proseTags.join(',')
        const selection = this.selectProseElements(proseSelector, node, iteration)
        for (const n of selection) {
            let weight = Math.min(this.calculateTextLength(n, iteration) / this.config.textLengthThreshold, 10) - 1
            let depth = this.config.textContainerTraversalDepth
            const decrement = weight / depth
            
            let p = n.parentNode
            while (p.parentNode && --depth) {
                if (this.#score(weight, p, iteration))
                    nodes.push(p)
                weight -= decrement
                p = p.parentNode
            }
        }

        let bestNode
        let bestScore = 0
        for (const n of nodes) {
            const score = this.#get('score', n, iteration)
            if (score > bestScore) {
                bestNode = n
                bestScore = score
            }
        }
        return bestNode
    }

    *getTextNodes(node = this.rootNode, iteration = this.iterator) {
        let isBlock = false
        const blockWrapper = document.createTextNode('\n')
        blockWrapper._preserveWhitespace = true

        for (let child = node.firstChild; child; child = child.nextSibling) {
            if (child.nodeType == Node.TEXT_NODE) {
                yield child
                isBlock = false
            } else if (child.nodeType == Node.ELEMENT_NODE
                && !this.isIgnored(child, iteration)
                && !this.isHidden(child)
            ) {
                const lastBlock = isBlock
                isBlock = blockWrapper && this.isBlock(child)
                if (isBlock && !lastBlock)
                    yield blockWrapper
                yield* this.getTextNodes(child, iteration)
                if (isBlock)
                    yield blockWrapper
            }
        }
    }

    /**
     * Returns the text length of an element and all its descendants, excluding hidden and
     * ignored elements. Text length is cached on each downstream element.
     * @param {HTMLElement} node Element to evaluate.
     * @param {int} iteration Iteration number. See `nextIteration` method for explanation.
     * @returns {int} Character count of relevant text under this node.
     */
    calculateTextLength(node = this.rootNode, iteration = this.iterator) {
        let len = this.#get('textlength', node, iteration) || 0
        if (!len) {
            for (let child = node.firstChild; child; child = child.nextSibling) {
                if (child.nodeType == Node.TEXT_NODE) {
                    len += child.textContent.replace(/\s+/g, ' ').trim().length
                } else if (child.nodeType == Node.ELEMENT_NODE
                    && !this.isIgnored(child, iteration)
                    && !this.isHidden(child)
                ) {
                    len += this.calculateTextLength(child, iteration)
                }
            }
            this.#set('textlength', len, node, iteration)
        }
        return len
    }
    
    calculateTextFill(selector, node = this.rootNode, iteration = this.iterator) {
        const textLength = this.calculateTextLength(node, iteration)
        if (textLength == 0)
            return 0
        let selectedTextLength = 0
        for (const n of this.select(selector, node, iteration))
            if ((!n.parentNode || !n.parentNode.closest(selector)))
                selectedTextLength += this.calculateTextLength(n, iteration)
        return selectedTextLength / textLength
    }

    extractArticleText(node = this.rootNode, iteration = this.iterator) {
        let text = ''
        const articleNode = this.findArticleContainer(node, iteration)
        if (articleNode)
            for (const n of this.getTextNodes(articleNode, iteration))
                text += n._preserveWhitespace
                    ? n.textContent
                    : n.textContent.replace(/\s+/g, ' ')
        return text.trim()
    }

    /**
     * Ignores every node in one or more node lists.
     * @param  {...NodeList} nodeList List of nodes to ignore. Each parameter must be a separate `NodeList`.
     */
    ignoreAll(...nodeList) {
        for (const list of nodeList)
            for (const e of list)
                this.ignore(e)
    }

    ignore(node = this.rootNode, iteration = this.iterator, ignore = true) {
        if (!this.isIgnored(node, iteration)) {
            this.#set('ignored', ignore, node, iteration)
            this.#set('textlength', ignore ? 0 : undefined, node, iteration)

            for (const n of node.children)
                this.ignore(n, iteration)
        }
    }

    isIgnored(node = this.rootNode, iteration = this.iterator) {
        return this.#get('ignored', node, iteration)
    }

    isSignificantTextLength(node = this.rootNode, iteration = this.iterator) {
        return this.calculateTextLength(node, iteration) >= this.config.textLengthThreshold
    }

    /**
     * Determines if an element is hidden, having zero flow impact to the page. Elements
     * styled as 'visibility: hidden' are considered visible because they have shape and
     * affect document flow.
     * @param {HTMLElement} node Element to assess. 
     * @param {int} iteration Iteration number. See `nextIteration` method for explanation.
     * @param {boolean} autoIgnore Whether to automatically `ignore` the element if it is hidden.
     * @returns {boolean} Boolean indicating if the node is hidden.
     */
    isHidden(node = this.rootNode, iteration = this.iterator, autoIgnore = true) {
        const hidden = !node.offsetWidth && !node.getClientRects()
        if (hidden && autoIgnore)
            this.ignore(node, iteration)
        return hidden
    }

    /**
     * Performantly estimates if the node is a block element based on the display or
     * position style explicitly set on the element (i.e., not set via stylesheet), or, if
     * none, the default display value of the tag.
     * @param {HTMLElement} node Element to assess. 
     * @returns {boolean} Boolean indicating if the node is probably block-style.
     */
    isBlock(node = this.rootNode) {
        const display = node.style.display
        if (display && this.config.blockDisplayStyles.includes(display.toLowerCase()))
            return true
        const position = node.style.position
        if (position && this.config.blockPositionStyles.includes(position.toLowerCase()))
            return true
        return this.config.blockTags.includes(node.tagName.toLowerCase())
    }

    #get(property, node = this.rootNode, iteration = this.iterator) {
        if (node._escrape && node._escrape[iteration])
            return node._escrape[iteration][property]
    }

    #set(property, value, node = this.rootNode, iteration = this.iterator) {
        node._escrape ??= {}
        node._escrape[iteration] ??= {}
        node._escrape[iteration][property] = value        
    }

    /**
     * Assigns an element a score based on the presence of keywords in the class, tag name, or id. 
     * @param {int} weight Length-based incremental score to add to the element.
     * @param {HTMLElement} node Element to evaluate.
     * @param {int} iteration Iteration number. See `nextIteration` method for explanation.
     * @returns {boolean} `True` if calculating the initial score; `False` if updating the cached score.
     */
    #score(weight, node = this.rootNode, iteration = this.iterator) {
        const currentScore = this.#get('score', node, iteration)        
        if (currentScore != null) {
            this.#set('score', currentScore + weight, node, iteration)
            return false
        }
        const tagName = node.tagName.toLowerCase()
        const searchStr =`.${node.className.toLowerCase().replace(' ', ' .')} #${node.id.toLowerCase()} +${tagName} `
        let highest = 0
        let lowest = 0
        for (const k in this.config.selectorKeywordScores)
            if (searchStr.includes(k)) {
                const val = this.config.selectorKeywordScores[k]
                if (val > highest)
                    highest = val
                else if (val < lowest)
                    lowest = val
            }
        this.#set('score', highest + lowest + weight, node, iteration)
        return true
    }
}
