const defaultConfig = {
    keywords: {
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
        'attribution': -25,
        'combx': -25,
        'comment': -25,
        'contact': -25,
        'reference': -25,
        'foot': -25,
        'footer': -25,
        'footnote': -25,
        'infobox': -25,
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
    },
    selectors: {
        blockDisplayStyles: ['block', 'flex', 'grid', 'inline-block', 'inline-flex'],
        blockTags: ['address', 'article', 'aside', 'blockquote', 'br', 'canvas', 'dd', 'div', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'hr', 'li', 'main', 'nav', 'noscript', 'ol', 'p', 'pre', 'section', 'table', 'td', 'th', 'tr', 'thead', 'tfoot', 'ul', 'video'],

        readableTags: ['article', 'div', 'p', 'pre', 'section', 'span', 'td'],
        listItemTags: ['dl', 'dt', 'dd', 'li', 'ol', 'td', 'ul'],
        listableTags: ['dl', 'dt', 'dd', 'li', 'ol', 'p', 'span', 'td', 'ul'],        
        headingTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        metaTags: ['head', 'link', 'meta', 'noscript', 'script', 'style'],
        descriptiveTags: ['address', 'blockquote', 'cite', 'code', 'figcaption', 'form', 'label', 'output', 'pre', 'sup', 'tfoot'],
        interactiveTags: ['button', 'canvas', 'dialog', 'embed', 'figure', 'frame', 'iframe', 'img', 'input', 'menu', 'menuitem', 'nav', 'object', 'select', 'svg', 'textarea', 'video'],
        interactiveRoles: ['alert', 'alertdialog', 'banner', 'button', 'columnheader', 'combobox', 'dialog', 'directory', 'figure', 'heading', 'img', 'listbox', 'marquee', 'math', 'menu', 'menubar', 'menuitem', 'navigation', 'option', 'search', 'searchbox', 'status', 'toolbar', 'tooltip'],
        asideClasses: ['blogroll', 'caption', 'citation', 'comment', 'community', 'contact', 'copyright', 'extra', 'foot', 'footer', 'footnote', 'infobox', 'masthead', 'media', 'meta', 'metadata', 'mw-jump-link', 'mw-revision', 'navigation', 'navigation-not-searchable', 'noprint', 'outbrain', 'pager', 'popup', 'promo', 'reference', 'reference-text', 'references', 'related', 'related-articles', 'remark', 'rss', 's-popover', 'scroll', 'shopping', 'shoutbox', 'sidebar', 'sponsor', 'tag-cloud', 'tags', 'thumb', 'tool', 'user-info', 'widget', 'wikitable'],
    },
}

class Escrape {
    #visualSelector

    constructor(element, config = defaultConfig) {
        this.setConfig(config)
        this.element = element // document.createElement('body')
        // TODO: The next line messes up text inside of pre, input, etc.
        //this.element.innerHTML = this.collapseWhitespace(element.innerHTML)
    }

    setConfig(config) {
        this.config = {...defaultConfig, ...config}
        this.#visualSelector = this.config.selectors.descriptiveTags.join(',')
            + ',' + this.config.selectors.interactiveTags.join(',')
            + ',[role=' + this.config.selectors.interactiveRoles.join('],[role=') + ']'
    }

	getDescription(document) {
		var metas = this.element.querySelectorAll('meta[description],meta[name=description],meta[property=og\\:description]');
		for (var meta of metas) {
			if (meta.description)
				return meta.description;
			if (meta.content)
				return meta.content;
		}
		var shortDescription = this.element.querySelectorAll('.shortdescription');
		if (shortDescription.length == 1)
			return shortDescription[0].innerText; // TODO: Convert to method?

		return '';
	}

	getTitle(document) {
		var h1s = this.element.querySelectorAll('h1')
		if (h1s.length == 1)
			return h1s[0].innerText // TODO: Convert to method?
		return document.title.split(' - ')[0].trim()
    }
    
    calculateTextFill(selector, node = this.element, baseText = null) {
        baseText ??= this.getNodeText(node)
        const baseTextLength = baseText.length
        const selectedNodes = node.querySelectorAll(selector)
        let selectedTextLength = 0
        for (const n of selectedNodes)
            selectedTextLength += this.getNodeText(n).length
        
        const unselectedTextLength = baseTextLength - selectedTextLength

        return {
            baseText,
            baseTextLength,
            selectedNodes,
            selectedTextLength,
            unselectedTextLength,
            textLengthRatio: baseTextLength ? selectedTextLength / baseTextLength : 0,
            nodePerChar: selectedNodes ? unselectedTextLength / selectedNodes.length : 0,
        }
    }

    isVisualContainer(node) {
        const text = this.getNodeText(node)
        if (text.length < 75 || text.split(',').length < 5) // TODO:
            return true

        const fill = this.calculateTextFill(this.#visualSelector, node, text)
        if (fill.textLengthRatio > 0.4) // TODO:
            return true
        if (fill.nodePerChar > 1000) // TODO:
            return true
        return false
    }

    *getVisualContainers(node = this.element) {
        const loopNodes = [...node.querySelectorAll(this.#visualSelector)]

        let currentNode
        while (currentNode = loopNodes.shift()) {
            currentNode._visualState = 'visual'

            const parent = currentNode.parentNode
            if (parent) {
                if (parent._visualState)
                    continue
                parent._visualState = 'nonvisual'

                if (this.isVisualContainer(parent)) {
                    loopNodes.push(parent)
                    parent._visualState = 'visual'
                    currentNode._visualState = 'intermediate'
                }
            }
            yield currentNode
        }
    }

    *getTopmostVisualContainers(node = this.element) {
        for (const n of this.getVisualContainers(node)) {
            let traverseNode = n.parentNode
            while (traverseNode) {
                if (traverseNode._visualState == 'visual')
                    break
                traverseNode = traverseNode.parentNode
            }
            if (traverseNode)
                yield n
        }
    }

    *getHyperlinkContainers(node = this.element) {
        const selector = this.config.selectors.listableTags.join(',')
        const itemNodes = node.querySelectorAll(selector)
        for (const n of itemNodes) {
            const fill = this.calculateTextFill('a', node)
            if (fill.textLengthRatio > 0.4) // TODO:
                yield n
        }

        const divNodes = node.querySelectorAll('div>a,section>a') // TODO:
        for (const n of divNodes) {
            const parent = n.parentNode
            const fill = this.calculateTextFill('a', parent)
            if (fill.textLengthRatio > 0.4) // TODO:
                yield parent
        }
    }

    getReadableContainer(node = this.element) {
        const top = this.getReadableContainers(1, node)
        return top && top[0]
    }

    getReadableContainers(topN = null, node = this.element) {
        for (const e of node.querySelectorAll(this.config.selectors.metaTags))
            this.markAsNontext(e)
        for (const e of this.getVisualContainers(node))
            this.markAsNontext(e)
        for (const e of this.getHyperlinkContainers(node))
            this.markAsNontext(e)

        let eligibleNodes = []
        const selector = this.config.selectors.readableTags.join(',')
        const readableNodes = this.element.querySelectorAll(selector)
        for (const n of readableNodes) {
            let weight = this.calculateWeight(n)
            if (!weight)
                continue

            let i = 2 // TODO:
            let p = n.parentNode
            
            while (p && --i) {
                if (p._score == null) {
                    this.scoreContainer(p)
                    eligibleNodes.push(p)
                }
                p._score += weight
                weight /= 2
                p = p.parentNode
            }
        }

        eligibleNodes = eligibleNodes.filter(n => n._score > 0)
        eligibleNodes = eligibleNodes.sort((a,b) => b._score - a._score)
        eligibleNodes = eligibleNodes.slice(0, topN || eligibleNodes.length)
        return eligibleNodes
    }

    calculateWeight(node = this.element) {
        const text = this.getNodeText(node)
        if (text.length < 25) // TODO:
            return 0
        const fill = this.calculateTextFill(this.#visualSelector, node, text)
        const score = 1
            + text.split(',').length
            + Math.min(text.length / 100, 3)
            + 1 - fill.textLengthRatio
        return score
    }

    scoreContainer(node = this.element) {
        const tagName = node.tagName.toLowerCase()
        const searchStr =`${node.className.toLowerCase()} ${node.id.toLowerCase()} ${tagName}`
        node._score = 0
        for (const k in this.config.keywords)
            if (searchStr.includes(k))
                node._score += this.config.keywords[k]
        if (['div', 'p', 'section', 'article'].includes(tagName)) // TODO:
            node._score += 5
        else if (this.config.selectors.readableTags.includes(tagName))
            node._score += 3
        else if (this.config.selectors.listItemTags.includes(tagName))
            node._score -= 3
        return node._score
    }

	extractReadableContent(node = this.element) {
        // TODO: Write this method.

        // .replace(/ {2,}/g, ' ')
	    // .replace(/[\r\n\t]+/g, '\n')

        return this.getNodeText(node)
    }

    getNodeText(node = this.element, collapseWhitespace = true, lowercase = false) {
        let text = this.#getNodeText(node)
        if (collapseWhitespace)
            text = this.collapseWhitespace(text)
        if (lowercase)
            text = text.toLowerCase()
        return text
    }
    #getNodeText(node) {
        let text = ''
        let child = node.firstChild
        let isBlock = false

        while (child) {
            if (child.nodeType == Node.TEXT_NODE) {
                text += child.textContent.trim() + ' '
                isBlock = false
            } else if (child.nodeType == Node.ELEMENT_NODE && !this.isMarkedAsNontext(child) && !this.isHidden(child)) {
                const lastBlock = isBlock
                isBlock = this.#isBlockElement(child)

                if (isBlock && !lastBlock)
                    text += '\n'

                text += this.#getNodeText(child)

                if (isBlock)
                    text += '\n'
            }
            child = child.nextSibling
        }
        return text
    }

    collapseWhitespace(str) {
        return str.replace(/\s+/g, ' ')
    }

    markAsNontext(node, isNontext = true) {
        node._nontext = isNontext
    }

    isMarkedAsNontext(node) {
        return node._nontext
    }

    isHidden(node) {
        return !node.offsetWidth && !node.getClientRects()
    }

    #isBlockElement(node = this.element) {
        const display = node.style.display.toLowerCase()
        return this.config.selectors.blockDisplayStyles.includes(display)
            || this.config.selectors.blockTags.includes(node.tagName.toLowerCase())
    }
}
